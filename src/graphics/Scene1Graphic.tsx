import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, FONT_STACK, Scrim } from "./primitives";

/** Hook: a masked/mystery word + pulsing "?" to create a curiosity gap. */
export const Scene1Graphic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 15 },
    durationInFrames: 15,
  });
  const pulse = 1 + Math.sin(frame / 6) * 0.06;

  return (
    <AbsoluteFill>
      <Scrim />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 160,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            transform: `scale(${enter})`,
            opacity: enter,
          }}
        >
          <div
            style={{
              fontFamily: FONT_STACK,
              fontWeight: 900,
              fontSize: 64,
              color: "white",
              background: "rgba(255,255,255,0.12)",
              border: `3px solid ${ACCENT}`,
              borderRadius: 16,
              padding: "10px 34px",
              letterSpacing: 4,
            }}
          >
            ███████
          </div>
          <div
            style={{
              fontFamily: FONT_STACK,
              fontWeight: 900,
              fontSize: 80,
              color: ACCENT,
              transform: `scale(${pulse})`,
            }}
          >
            ?
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
