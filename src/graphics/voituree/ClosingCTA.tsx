import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_STACK, Scrim, stampTextStyle } from "../primitives";
import { TEAL } from "./palette";

/** CTA to camera: no price mentioned in this script, just the button + closing line. */
export const ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonIn = spring({
    frame,
    fps,
    config: { damping: 12 },
    durationInFrames: 16,
  });
  const lineIn = spring({
    frame: frame - 30,
    fps,
    config: { damping: 13 },
    durationInFrames: 16,
  });
  const pulse = 1 + Math.sin(frame / 5) * 0.04;

  return (
    <AbsoluteFill>
      <Scrim />
      <AbsoluteFill
        style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 170 }}
      >
        <div
          style={{
            fontFamily: FONT_STACK,
            fontWeight: 800,
            fontSize: 46,
            color: "white",
            border: `4px solid ${TEAL}`,
            borderRadius: 46,
            padding: "20px 54px",
            opacity: buttonIn,
            transform: `scale(${buttonIn * pulse})`,
          }}
        >
          En savoir plus
        </div>

        <div
          style={{
            ...stampTextStyle,
            fontSize: 52,
            color: TEAL,
            marginTop: 34,
            maxWidth: "85%",
            textAlign: "center",
            opacity: lineIn,
            transform: `translateY(${(1 - lineIn) * 20}px)`,
          }}
        >
          Toi aussi, tu vas y arriver !
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
