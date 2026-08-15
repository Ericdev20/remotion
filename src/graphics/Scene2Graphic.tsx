import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, FONT_STACK, Scrim } from "./primitives";

/** Contrast: "EUX" vs "LA MAJORITÉ" sliding in to meet at a "VS". */
export const Scene2Graphic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timed to the actual voice-over: "riche" is said ~0.73s into this beat,
  // "majorité" only right at the end (~3.9s in, beat is ~4.9s long).
  const leftIn = spring({
    frame: frame - 22,
    fps,
    config: { damping: 18 },
    durationInFrames: 18,
  });
  const rightIn = spring({
    frame: frame - 117,
    fps,
    config: { damping: 18 },
    durationInFrames: 18,
  });
  const vsScale = spring({
    frame: frame - 85,
    fps,
    config: { damping: 10 },
    durationInFrames: 12,
  });

  const label: React.CSSProperties = {
    fontFamily: FONT_STACK,
    fontWeight: 900,
    fontSize: 42,
    color: "white",
    WebkitTextStroke: "2px black",
    paintOrder: "stroke fill",
    textTransform: "uppercase",
    background: "rgba(0,0,0,0.35)",
    padding: "12px 22px",
    borderRadius: 12,
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill>
      <Scrim />
      <AbsoluteFill
        style={{ justifyContent: "flex-start", paddingTop: 150 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              ...label,
              transform: `translateX(${(1 - leftIn) * -300}px)`,
              opacity: leftIn,
            }}
          >
            EUX
          </div>
          <div
            style={{
              fontFamily: FONT_STACK,
              fontWeight: 900,
              fontSize: 38,
              color: ACCENT,
              transform: `scale(${vsScale})`,
            }}
          >
            VS
          </div>
          <div
            style={{
              ...label,
              transform: `translateX(${(1 - rightIn) * 300}px)`,
              opacity: rightIn,
            }}
          >
            LA MAJORITÉ
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
