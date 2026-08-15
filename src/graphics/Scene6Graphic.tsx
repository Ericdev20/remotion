import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ACCENT, FONT_STACK, Scrim } from "./primitives";

/** CTA: price tag pop, then a pulsing "En savoir plus" button. */
export const Scene6Graphic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timed to the actual voice-over: "4 950" is said ~0.9s into this beat,
  // "Clique sur en savoir plus" only starts ~3.5s in.
  const priceIn = spring({
    frame: frame - 20,
    fps,
    config: { damping: 11 },
    durationInFrames: 16,
  });
  const buttonIn = spring({
    frame: frame - 100,
    fps,
    config: { damping: 14 },
    durationInFrames: 16,
  });
  const pulse = 1 + Math.sin(Math.max(0, frame - 116) / 5) * 0.04;
  // Subtle Ken Burns: slow zoom-in on the coin badge over the 3s after it appears.
  const kenBurns = interpolate(frame, [20, 110], [1, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Scrim />
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 150,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            transform: `scale(${priceIn}) rotate(${(1 - priceIn) * -6}deg)`,
            opacity: priceIn,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid black",
              flexShrink: 0,
            }}
          >
            <Img
              src={staticFile("assets/cta.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${kenBurns})`,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: FONT_STACK,
              fontWeight: 900,
              fontSize: 60,
              color: "black",
              background: ACCENT,
              borderRadius: 16,
              padding: "14px 36px",
            }}
          >
            4 950 FCFA
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            fontFamily: FONT_STACK,
            fontWeight: 800,
            fontSize: 36,
            color: "white",
            border: `3px solid ${ACCENT}`,
            borderRadius: 40,
            padding: "16px 44px",
            opacity: buttonIn,
            transform: `scale(${buttonIn * pulse})`,
          }}
        >
          👉 En savoir plus
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
