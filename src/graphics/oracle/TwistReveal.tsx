import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_STACK, Scrim, stampTextStyle } from "../primitives";
import { GOLD } from "./palette";

/**
 * The narrative twist: "pas les esprits" gets struck through, then
 * "MAUVAISE GESTION" is revealed underneath — timed to when each phrase is
 * actually said ("les esprits" ~2.5s in, "ton argent" ~4.6s in).
 */
export const TwistReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1In = spring({
    frame: frame - 70,
    fps,
    config: { damping: 16 },
    durationInFrames: 14,
  });
  const strike = interpolate(frame, [92, 104], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2In = spring({
    frame: frame - 135,
    fps,
    config: { damping: 11, stiffness: 220 },
    durationInFrames: 16,
  });

  return (
    <AbsoluteFill>
      <Scrim />
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 170,
        }}
      >
        <div
          style={{
            position: "relative",
            opacity: line1In,
            transform: `scale(${line1In})`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_STACK,
              fontWeight: 800,
              fontSize: 46,
              color: "white",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Pas les esprits
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              height: 4,
              background: "rgba(220,60,50,0.9)",
              width: `${strike * 100}%`,
            }}
          />
        </div>

        <div
          style={{
            ...stampTextStyle,
            fontSize: 68,
            color: GOLD,
            marginTop: 26,
            letterSpacing: 1,
            whiteSpace: "nowrap",
            opacity: line2In,
            transform: `scale(${line2In}) rotate(${(1 - line2In) * -5}deg)`,
          }}
        >
          MAUVAISE GESTION
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
