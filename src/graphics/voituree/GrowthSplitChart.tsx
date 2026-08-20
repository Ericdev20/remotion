import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_STACK, Scrim } from "../primitives";
import { TEAL } from "./palette";

// Each month, "pour toi" stays constant while "objectifs" accumulates —
// illustrating the actual mechanic being described, not just decoration.
const MONTHS = [
  { label: "M1", toi: 52, objectifs: 26 },
  { label: "M2", toi: 52, objectifs: 58 },
  { label: "M3", toi: 52, objectifs: 98 },
  { label: "M4", toi: 52, objectifs: 143 },
];

const BAR_WIDTH = 84;
const GAP = 44;

/** Illustrates "une part pour toi, une part pour tes objectifs" as a growing stacked bar chart. */
export const GrowthSplitChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Scrim />
      <AbsoluteFill
        style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 170 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: GAP,
            height: 270,
          }}
        >
          {MONTHS.map((month, i) => {
            const enter = spring({
              frame: frame - i * 9,
              fps,
              config: { damping: 13 },
              durationInFrames: 14,
            });
            const total = month.toi + month.objectifs;

            return (
              <div
                key={month.label}
                style={{
                  width: BAR_WIDTH,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: BAR_WIDTH,
                    height: total,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    transform: `scaleY(${enter})`,
                    transformOrigin: "bottom",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ height: month.objectifs, background: "rgba(255,255,255,0.9)" }} />
                  <div style={{ height: month.toi, background: TEAL }} />
                </div>
                <div
                  style={{
                    marginTop: 14,
                    fontFamily: FONT_STACK,
                    fontWeight: 700,
                    fontSize: 28,
                    color: "white",
                    opacity: enter,
                  }}
                >
                  {month.label}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 36, marginTop: 32 }}>
          <Legend color={TEAL} label="Pour toi" />
          <Legend color="rgba(255,255,255,0.9)" label="Objectifs" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Legend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 18, height: 18, borderRadius: 5, background: color }} />
    <span
      style={{
        fontFamily: FONT_STACK,
        fontWeight: 700,
        fontSize: 28,
        color: "white",
      }}
    >
      {label}
    </span>
  </div>
);
