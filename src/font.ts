import { loadFont } from "@remotion/google-fonts/Montserrat";

// Bundled as a web font so rendering is identical everywhere (Studio on
// macOS, GitHub Actions on Linux, etc.) instead of depending on whichever
// system fonts happen to be installed on the machine doing the render.
export const { fontFamily } = loadFont("normal", {
  weights: ["800", "900"],
  subsets: ["latin", "latin-ext"],
});
