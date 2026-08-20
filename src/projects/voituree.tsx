import { CalculateMetadataFunction, Composition } from "remotion";
import { VideoWithMotionGraphics, Beat, ZoomKeyframe } from "../VideoWithMotionGraphics";
import { getVideoDurationInFrames } from "../utils/getVideoDurationInFrames";
import { Outro } from "../graphics/Outro";
import { SpeechBubble } from "../graphics/voituree/SpeechBubble";
import { GrowthSplitChart } from "../graphics/voituree/GrowthSplitChart";
import { ClosingCTA } from "../graphics/voituree/ClosingCTA";
import { TEAL } from "../graphics/voituree/palette";

const FPS = 30;
const WIDTH = 1440;
const HEIGHT = 2528;

const VIDEO_SRC = "voituree.mov";
const CAPTIONS_SRC = "captions-voituree.json";
const OUTRO_DURATION_IN_FRAMES = 45; // 1.5s closing card

/**
 * Beats follow the dialogue's own turn-taking (see
 * public/captions-voituree.json) rather than a fixed 6-block template —
 * two colleagues facing each other, so each turn gets a speech bubble
 * anchored to whichever side that speaker is on (left = the one who
 * saved up, who later turns to camera for the CTA; right = the friend).
 */
const BEATS: Beat[] = [
  { fromMs: 0, graphic: () => <SpeechBubble side="left" text="Objectif atteint !" /> },
  {
    fromMs: 3800,
    graphic: () => (
      <SpeechBubble side="right" text="Même salaire... et je n'économise jamais." />
    ),
  },
  {
    fromMs: 10440,
    graphic: () => <SpeechBubble side="left" text="Pas une question de salaire." typewriter />,
  },
  { fromMs: 15400, graphic: () => <GrowthSplitChart /> },
  { fromMs: 18240, graphic: () => <SpeechBubble side="right" text="Comment ?" /> },
  { fromMs: 19240, graphic: () => <SpeechBubble side="left" text="Un kit budgétaire." /> },
  { fromMs: 26120, graphic: () => <SpeechBubble side="right" text="Je veux ça !" /> },
  { fromMs: 27240, graphic: () => <ClosingCTA /> },
];

/** Slow push-in over the whole video, with an extra punch during the twist beat. */
const ZOOM_KEYFRAMES: ZoomKeyframe[] = [
  { ms: 0, scale: 1.0 },
  { ms: 10440, scale: 1.03 },
  { ms: 13000, scale: 1.09 },
  { ms: 15400, scale: 1.09 },
  { ms: 30840, scale: 1.13 },
];

type Props = {
  durationInFrames: number;
};

const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const videoDurationInFrames = await getVideoDurationInFrames(VIDEO_SRC, FPS);
  const durationInFrames = videoDurationInFrames + OUTRO_DURATION_IN_FRAMES;

  return {
    durationInFrames,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    props: { durationInFrames },
  };
};

export const VoitureeComposition = () => {
  return (
    <Composition
      id="MontageVoituree"
      component={VoitureeVideo}
      durationInFrames={60}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ durationInFrames: 60 }}
      calculateMetadata={calculateMetadata}
    />
  );
};

const VoitureeVideo: React.FC<Props> = ({ durationInFrames }) => {
  return (
    <VideoWithMotionGraphics
      videoSrc={VIDEO_SRC}
      captionsSrc={CAPTIONS_SRC}
      beats={BEATS}
      durationInFrames={durationInFrames}
      zoomKeyframes={ZOOM_KEYFRAMES}
      outro={{
        durationInFrames: OUTRO_DURATION_IN_FRAMES,
        graphic: <Outro accent={TEAL} />,
      }}
    />
  );
};
