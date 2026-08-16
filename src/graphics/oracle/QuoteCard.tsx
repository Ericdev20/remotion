import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_STACK, Scrim } from "../primitives";
import { GOLD } from "./palette";

/**
 * The punchline, treated as a proverb/quote card — timed to when the line
 * is actually said (~1.9s into this beat, after the setup question).
 */
export const QuoteCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - 55,
    fps,
    config: { damping: 18 },
    durationInFrames: 20,
  });

  return (
    <AbsoluteFill>
      <Scrim />
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 160,
        }}
      >
        <div
          style={{
            maxWidth: "80%",
            textAlign: "center",
            opacity: enter,
            transform: `translateY(${(1 - enter) * -20}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_STACK,
              fontWeight: 900,
              fontSize: 64,
              color: GOLD,
              lineHeight: 0.9,
            }}
          >
            “
          </div>
          <div
            style={{
              fontFamily: FONT_STACK,
              fontWeight: 800,
              fontSize: 40,
              color: "white",
              letterSpacing: 0.5,
            }}
          >
            Même les esprits respectent
            <br />
            un homme organisé
          </div>
          <div
            style={{
              width: 60,
              height: 3,
              background: GOLD,
              margin: "18px auto 0",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
