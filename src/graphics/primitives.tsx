import { AbsoluteFill } from "remotion";
import { fontFamily } from "../font";

export const FONT_STACK = fontFamily;
export const ACCENT = "#39E508";

/** Dark gradient behind the upper part of the frame so graphics stay legible over any footage. */
export const Scrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%)",
    }}
  />
);

export const stampTextStyle: React.CSSProperties = {
  fontFamily: FONT_STACK,
  fontWeight: 900,
  WebkitTextStroke: "3px black",
  paintOrder: "stroke fill",
  textShadow: "0 8px 16px rgba(0,0,0,0.5)",
};
