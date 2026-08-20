import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_STACK } from "./primitives";

type OutroProps = {
  accent: string;
  title?: string;
  cta?: string;
};

/** A closing branded card so the video doesn't just cut off after the last beat. */
export const Outro: React.FC<OutroProps> = ({
  accent,
  title = "Kit Budgétaire",
  cta = "En savoir plus",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14 },
    durationInFrames: 14,
  });
  const ctaIn = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14 },
    durationInFrames: 14,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity: enter,
          transform: `scale(${enter})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_STACK,
            fontWeight: 900,
            fontSize: 72,
            color: "white",
            letterSpacing: 1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 100,
            height: 4,
            background: accent,
            margin: "22px auto",
          }}
        />
        <div
          style={{
            fontFamily: FONT_STACK,
            fontWeight: 700,
            fontSize: 40,
            color: accent,
            opacity: ctaIn,
            transform: `translateY(${(1 - ctaIn) * 10}px)`,
          }}
        >
          {cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
