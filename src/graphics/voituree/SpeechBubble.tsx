import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_STACK } from "../primitives";
import { BUBBLE_BG, BUBBLE_TEXT } from "./palette";

type SpeechBubbleProps = {
  /** Which side of the frame this speaker is on. */
  side: "left" | "right";
  text: string;
  /** Reveal the text letter by letter instead of popping in all at once. */
  typewriter?: boolean;
};

/**
 * A comic-style speech bubble anchored to one side of the frame, echoing
 * the fact that this footage is a face-to-face dialogue between two people
 * — a different visual grammar from the centered stat cards used in the
 * other two projects.
 */
export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  side,
  text,
  typewriter = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14 },
    durationInFrames: 14,
  });

  const charsToShow = typewriter
    ? Math.floor(
        interpolate(
          frame,
          [4, 4 + Math.max(10, text.length * 1.4)],
          [0, text.length],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      )
    : text.length;
  const shown = typewriter ? text.slice(0, charsToShow) : text;
  const caretVisible = typewriter && charsToShow < text.length && frame % 20 < 10;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: side === "left" ? "flex-start" : "flex-end",
        paddingTop: 190,
        paddingLeft: side === "left" ? 60 : 0,
        paddingRight: side === "right" ? 60 : 0,
      }}
    >
      <div
        style={{
          position: "relative",
          background: BUBBLE_BG,
          color: BUBBLE_TEXT,
          borderRadius: 32,
          padding: "26px 36px",
          maxWidth: 780,
          opacity: enter,
          transform: `scale(${enter}) translateY(${(1 - enter) * -20}px)`,
          fontFamily: FONT_STACK,
          fontWeight: 800,
          fontSize: 44,
          lineHeight: 1.2,
          textAlign: side === "left" ? "left" : "right",
          boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
        }}
      >
        {shown}
        {caretVisible ? "|" : ""}
        <div
          style={{
            position: "absolute",
            bottom: -18,
            [side === "left" ? "left" : "right"]: 48,
            width: 0,
            height: 0,
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: `22px solid ${BUBBLE_BG}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
