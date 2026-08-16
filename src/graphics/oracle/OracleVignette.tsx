import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * A very subtle, slowly breathing dark vignette — used on beats where the
 * scene's own cinematography already carries the moment and text/graphics
 * would only get in the way. Adds a touch of tension without any text.
 */
export const OracleVignette: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 30), [-1, 1], [0.35, 0.55]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${pulse}) 100%)`,
      }}
    />
  );
};
