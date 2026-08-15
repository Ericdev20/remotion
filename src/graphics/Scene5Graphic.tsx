import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ACCENT, FONT_STACK, Scrim } from "./primitives";

type Scene5GraphicProps = {
  durationInFrames: number;
};

/** The emotional payoff: a goal ring filling up, ending on a calm checkmark. */
export const Scene5Graphic: React.FC<Scene5GraphicProps> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const size = 220;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = interpolate(frame, [10, durationInFrames - 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const checkPop = spring({
    frame: frame - (durationInFrames - 35),
    fps,
    config: { damping: 10 },
    durationInFrames: 14,
  });

  return (
    <AbsoluteFill>
      <Scrim />
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 130,
        }}
      >
        <div style={{ position: "relative", width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={ACCENT}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 70,
              transform: `scale(${1 + checkPop * 0.3})`,
            }}
          >
            {progress >= 0.98 ? "✅" : "🎯"}
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: FONT_STACK,
            fontWeight: 800,
            fontSize: 30,
            color: "white",
            background: "rgba(0,0,0,0.35)",
            borderRadius: 12,
            padding: "8px 20px",
          }}
        >
          Objectif atteint
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
