import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import type { Caption, TikTokPage } from "@remotion/captions";
import { createTikTokStyleCaptions } from "@remotion/captions";
import { fontFamily } from "../font";

type Word = { text: string; fromMs: number; toMs: number };

/**
 * Whisper often splits multi-syllable words into several sub-word tokens
 * (e.g. "budgétaire" -> "bud" + "g" + "éta" + "ire"), each with its own
 * timestamp. @remotion/captions keeps them as separate tokens within a page,
 * so we re-glue any token that doesn't start with a space onto the previous
 * one — otherwise they'd render as separate, independently-highlighted
 * "words" with a visible gap between them.
 */
const groupIntoWords = (tokens: TikTokPage["tokens"]): Word[] => {
  const words: Word[] = [];
  for (const token of tokens) {
    if (words.length === 0 || token.text.startsWith(" ")) {
      words.push({
        text: token.text.trimStart(),
        fromMs: token.fromMs,
        toMs: token.toMs,
      });
    } else {
      const last = words[words.length - 1];
      last.text += token.text;
      last.toMs = token.toMs;
    }
  }
  return words;
};

// How often the caption "page" switches, in ms.
// Kept low so captions read word-by-word, social-media style.
const SWITCH_CAPTIONS_EVERY_MS = 900;

const HIGHLIGHT_COLOR = "#39E508";

type AnimatedCaptionsProps = {
  captionsSrc: string;
};

export const AnimatedCaptions: React.FC<AnimatedCaptionsProps> = ({
  captionsSrc,
}) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender(`Loading ${captionsSrc}`));

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile(captionsSrc));
      const data = (await response.json()) as Caption[];
      setCaptions(data);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [captionsSrc, continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const { pages } = useMemo(() => {
    if (!captions) {
      return { pages: [] as TikTokPage[] };
    }
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
  }, [captions]);

  const { fps } = useVideoConfig();

  if (!captions) {
    return null;
  }

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps,
        );
        const durationInFrames = Math.round(endFrame - startFrame);

        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={page.startMs}
            from={Math.round(startFrame)}
            durationInFrames={durationInFrames}
            layout="none"
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current time relative to the start of this Sequence.
  const currentTimeMs = (frame / fps) * 1000;
  // Convert to absolute time by adding the page's start offset.
  const absoluteTimeMs = page.startMs + currentTimeMs;

  const words = groupIntoWords(page.tokens);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 160,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "85%",
          gap: "10px 26px",
        }}
      >
        {words.map((word) => {
          const isActive =
            word.fromMs <= absoluteTimeMs && word.toMs > absoluteTimeMs;
          const hasPlayed = word.toMs <= absoluteTimeMs;

          // Frame at which this word started being spoken, relative to this Sequence.
          const wordStartFrame = ((word.fromMs - page.startMs) / 1000) * fps;
          const framesSinceWordStart = frame - wordStartFrame;

          const pop = spring({
            frame: framesSinceWordStart,
            fps,
            config: {
              damping: 12,
              stiffness: 200,
              mass: 0.4,
            },
            durationInFrames: 10,
          });
          const scale = isActive ? 1 + pop * 0.1 : 1;

          return (
            <span
              key={word.fromMs}
              style={{
                fontFamily,
                fontSize: 68,
                fontWeight: 900,
                textTransform: "uppercase",
                whiteSpace: "pre",
                color: isActive || hasPlayed ? HIGHLIGHT_COLOR : "#FFFFFF",
                WebkitTextStroke: "2px black",
                paintOrder: "stroke fill",
                textShadow: "0 6px 12px rgba(0,0,0,0.55)",
                display: "inline-block",
                transform: `scale(${scale})`,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
