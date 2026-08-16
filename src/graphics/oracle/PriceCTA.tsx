import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_STACK, Scrim } from "../primitives";
import { GOLD } from "./palette";

/** CTA: price pop (said right at beat start), then the button (said ~2s in). */
export const PriceCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const priceIn = spring({
    frame,
    fps,
    config: { damping: 11 },
    durationInFrames: 16,
  });
  const buttonIn = spring({
    frame: frame - 61,
    fps,
    config: { damping: 14 },
    durationInFrames: 16,
  });
  const pulse = 1 + Math.sin(Math.max(0, frame - 77) / 5) * 0.04;

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
            fontFamily: FONT_STACK,
            fontWeight: 900,
            fontSize: 58,
            color: "black",
            background: GOLD,
            borderRadius: 16,
            padding: "14px 36px",
            transform: `scale(${priceIn}) rotate(${(1 - priceIn) * -6}deg)`,
            opacity: priceIn,
          }}
        >
          4950 FCFA
        </div>

        <div
          style={{
            marginTop: 40,
            fontFamily: FONT_STACK,
            fontWeight: 800,
            fontSize: 34,
            color: "white",
            border: `3px solid ${GOLD}`,
            borderRadius: 40,
            padding: "16px 44px",
            opacity: buttonIn,
            transform: `scale(${buttonIn * pulse})`,
          }}
        >
          En savoir plus
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
