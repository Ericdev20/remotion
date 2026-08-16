import { CalculateMetadataFunction, Composition } from "remotion";
import { VideoWithMotionGraphics, Beat } from "../VideoWithMotionGraphics";
import { getVideoDurationInFrames } from "../utils/getVideoDurationInFrames";
import { Scene1Graphic } from "../graphics/Scene1Graphic";
import { Scene2Graphic } from "../graphics/Scene2Graphic";
import { Scene3Graphic } from "../graphics/Scene3Graphic";
import { Scene4Graphic } from "../graphics/Scene4Graphic";
import { Scene5Graphic } from "../graphics/Scene5Graphic";
import { Scene6Graphic } from "../graphics/Scene6Graphic";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

const VIDEO_SRC = "vid-finale.mov";
const CAPTIONS_SRC = "captions-finale.json";

/**
 * Beats derived from the actual transcript of vid-finale.mov (see
 * public/captions-finale.json). Each beat pairs a segment of the voice-over
 * with a matching motion-graphic overlay, timed to when its content is
 * actually said.
 */
const BEATS: Beat[] = [
  { fromMs: 0, graphic: () => <Scene1Graphic /> },
  { fromMs: 5560, graphic: () => <Scene2Graphic /> },
  { fromMs: 10440, graphic: (d) => <Scene3Graphic durationInFrames={d} /> },
  { fromMs: 18720, graphic: () => <Scene4Graphic /> },
  { fromMs: 28320, graphic: (d) => <Scene5Graphic durationInFrames={d} /> },
  { fromMs: 35840, graphic: () => <Scene6Graphic /> },
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

export const BudgetKitComposition = () => {
  return (
    <Composition
      id="MontageFinal"
      component={BudgetKitVideo}
      durationInFrames={60}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ durationInFrames: 60 }}
      calculateMetadata={calculateMetadata}
    />
  );
};

const BudgetKitVideo: React.FC<Props> = ({ durationInFrames }) => {
  return (
    <VideoWithMotionGraphics
      videoSrc={VIDEO_SRC}
      captionsSrc={CAPTIONS_SRC}
      beats={BEATS}
      durationInFrames={durationInFrames}
    />
  );
};
