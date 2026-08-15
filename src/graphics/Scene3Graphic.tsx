import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ACCENT, FONT_STACK, Scrim, stampTextStyle } from "./primitives";

type Scene3GraphicProps = {
  durationInFrames: number;
};

/** The reveal: the word "PRÉVU" stamped in, then a before/after comparison. */
export const Scene3Graphic: React.FC<Scene3GraphicProps> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timed to the actual voice-over: the word "prévu" is first said ~0.93s
  // into this beat; "il me reste combien" ~3.4s in; "j'ai prévu combien" ~6s in.
  const stamp = spring({
    frame: frame - 28,
    fps,
    config: { damping: 9, stiffness: 220 },
    durationInFrames: 14,
  });
  const stampOpacity = interpolate(
    frame,
    [28, 38, durationInFrames - 40, durationInFrames - 20],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const oldIn = spring({
    frame: frame - 101,
    fps,
    config: { damping: 16 },
    durationInFrames: 15,
  });
  const newIn = spring({
    frame: frame - 181,
    fps,
    config: { damping: 16 },
    durationInFrames: 15,
  });

  const chip: React.CSSProperties = {
    fontFamily: FONT_STACK,
    fontWeight: 800,
    fontSize: 36,
    borderRadius: 12,
    padding: "10px 26px",
  };

  return (
    <AbsoluteFill>
      <Scrim />
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 140,
        }}
      >
        <div
          style={{
            ...stampTextStyle,
            fontSize: 120,
            color: ACCENT,
            letterSpacing: 4,
            transform: `scale(${stamp}) rotate(${(1 - stamp) * -8}deg)`,
            opacity: stampOpacity,
          }}
        >
          PRÉVU
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginTop: 60,
          }}
        >
          <div
            style={{
              ...chip,
              color: "white",
              background: "rgba(200,30,30,0.8)",
              opacity: oldIn,
              transform: `translateX(${(1 - oldIn) * -200}px)`,
            }}
          >
            ❌ "Il me reste combien ?"
          </div>
          <div
            style={{
              ...chip,
              color: "black",
              background: ACCENT,
              opacity: newIn,
              transform: `translateX(${(1 - newIn) * 200}px)`,
            }}
          >
            ✅ "J'ai prévu combien ?"
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
