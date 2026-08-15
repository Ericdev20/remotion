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

// Frame each category is actually said, relative to this beat's start
// (derived from the voice-over transcript: "Loyer, gaz, bouffe, transport,
// épargne" is only said in the second half of this beat, not at its start).
const CATEGORIES = [
  { photo: "assets/loyer.jpg", label: "Loyer", atFrame: 178 },
  { photo: "assets/gaz.jpg", label: "Gaz", atFrame: 191 },
  { photo: "assets/bouffe.jpg", label: "Bouffe", atFrame: 200 },
  { photo: "assets/transport.jpg", label: "Transport", atFrame: 215 },
  { photo: "assets/epargne.jpg", label: "Épargne", atFrame: 235 },
];

/** The product pitch: budget categories checking off one by one, filling a progress bar. */
export const Scene4Graphic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const firstItemFrame = CATEGORIES[0].atFrame;
  // Progress bar fills through the category list and finishes as
  // "planifié à l'avance" (the wrap-up) is said.
  const progress = interpolate(frame, [firstItemFrame, 270], [0, 1], {
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
          paddingTop: 130,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CATEGORIES.map((cat) => {
            const enter = spring({
              frame: frame - cat.atFrame,
              fps,
              config: { damping: 14 },
              durationInFrames: 12,
            });
            const checked = frame > cat.atFrame + 14;
            // Subtle Ken Burns: slow zoom-in over the 3s following its reveal.
            const kenBurns = interpolate(
              frame,
              [cat.atFrame, cat.atFrame + 90],
              [1, 1.08],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <div
                key={cat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: enter,
                  transform: `translateX(${(1 - enter) * -60}px)`,
                  background: "rgba(0,0,0,0.4)",
                  borderRadius: 14,
                  padding: "10px 22px",
                  minWidth: 340,
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `2px solid ${ACCENT}`,
                    flexShrink: 0,
                  }}
                >
                  <Img
                    src={staticFile(cat.photo)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: `scale(${kenBurns})`,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: FONT_STACK,
                    fontWeight: 800,
                    fontSize: 34,
                    color: "white",
                    flex: 1,
                  }}
                >
                  {cat.label}
                </span>
                <span
                  style={{
                    fontSize: 32,
                    color: ACCENT,
                    opacity: checked ? 1 : 0,
                  }}
                >
                  ✓
                </span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 30,
            width: 400,
            height: 16,
            borderRadius: 8,
            background: "rgba(255,255,255,0.25)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: ACCENT,
              borderRadius: 8,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
