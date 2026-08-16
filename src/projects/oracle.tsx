import { CalculateMetadataFunction, Composition } from "remotion";
import { VideoWithMotionGraphics, Beat } from "../VideoWithMotionGraphics";
import { getVideoDurationInFrames } from "../utils/getVideoDurationInFrames";
import { OracleVignette } from "../graphics/oracle/OracleVignette";
import { TwistReveal } from "../graphics/oracle/TwistReveal";
import { QuoteCard } from "../graphics/oracle/QuoteCard";
import { PriceCTA } from "../graphics/oracle/PriceCTA";

const FPS = 30;
// Matches the source video's native resolution (not a clean 1080x1920).
const WIDTH = 1440;
const HEIGHT = 2528;

const VIDEO_SRC = "oracle-video1.mov";
const CAPTIONS_SRC = "captions-oracle-video1.json";

/**
 * Beats derived from the transcript of oracle-video1.mov (see
 * public/captions-oracle-video1.json). The scene is already visually rich
 * (candlelit set, baked-in product shots for the pitch beat), so most beats
 * stay minimal — only the narrative twist and the punchline get a graphic.
 */
const BEATS: Beat[] = [
  { fromMs: 0, graphic: () => <OracleVignette /> },
  { fromMs: 6840, graphic: () => <OracleVignette /> },
  { fromMs: 10960, graphic: () => <TwistReveal /> },
  { fromMs: 16000, graphic: () => null },
  { fromMs: 22760, graphic: () => <QuoteCard /> },
  { fromMs: 26940, graphic: () => <PriceCTA /> },
];

type Props = {
  durationInFrames: number;
};

const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const durationInFrames = await getVideoDurationInFrames(VIDEO_SRC, FPS);

  return {
    durationInFrames,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    props: { durationInFrames },
  };
};

export const OracleComposition = () => {
  return (
    <Composition
      id="MontageOracle"
      component={OracleVideo}
      durationInFrames={60}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ durationInFrames: 60 }}
      calculateMetadata={calculateMetadata}
    />
  );
};

const OracleVideo: React.FC<Props> = ({ durationInFrames }) => {
  return (
    <VideoWithMotionGraphics
      videoSrc={VIDEO_SRC}
      captionsSrc={CAPTIONS_SRC}
      beats={BEATS}
      durationInFrames={durationInFrames}
    />
  );
};
