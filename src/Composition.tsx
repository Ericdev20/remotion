import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { parseMedia } from "@remotion/media-parser";
import { webReader } from "@remotion/media-parser/web";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

// Fade overlap between each scene, in frames.
export const TRANSITION_FRAMES = 15;

const SCENE_COMPONENTS = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];

type SceneData = {
  /** Scene duration = real duration of its voice-over, in frames. */
  durationInFrames: number;
  /** Native duration of the background video, in seconds (for looping). */
  videoDurationInSeconds: number;
};

type Props = {
  scenes: SceneData[];
};

const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const scenes: SceneData[] = await Promise.all(
    SCENE_COMPONENTS.map(async (_, index) => {
      const i = index + 1;

      const [audio, video] = await Promise.all([
        parseMedia({
          src: staticFile(`audio-prevu-${i}.wav`),
          reader: webReader,
          fields: { slowDurationInSeconds: true },
          acknowledgeRemotionLicense: true,
        }),
        parseMedia({
          src: staticFile(`prevu${i}.mp4`),
          reader: webReader,
          fields: { slowDurationInSeconds: true },
          acknowledgeRemotionLicense: true,
        }),
      ]);

      return {
        durationInFrames: Math.round(audio.slowDurationInSeconds * FPS),
        videoDurationInSeconds: video.slowDurationInSeconds,
      };
    }),
  );

  const totalDurationInFrames =
    scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0) -
    (scenes.length - 1) * TRANSITION_FRAMES;

  return {
    durationInFrames: Math.max(1, totalDurationInFrames),
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    props: { scenes },
  };
};

export const MyComposition = () => {
  return (
    <Composition
      id="MonMontage"
      component={MonMontageComponent}
      durationInFrames={60}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ scenes: [] as SceneData[] }}
      calculateMetadata={calculateMetadata}
    />
  );
};

export const MonMontageComponent: React.FC<Props> = ({ scenes }) => {
  if (scenes.length === 0) {
    return null;
  }

  return (
    <TransitionSeries>
      {scenes.flatMap((scene, index) => {
        const SceneComponent = SCENE_COMPONENTS[index];
        const isFirst = index === 0;
        const isLast = index === scenes.length - 1;

        const items = [
          <TransitionSeries.Sequence
            key={`scene-${index}`}
            durationInFrames={scene.durationInFrames}
          >
            <SceneComponent
              videoDurationInSeconds={scene.videoDurationInSeconds}
              durationInFrames={scene.durationInFrames}
              audioFadeInFrames={isFirst ? 0 : TRANSITION_FRAMES}
              audioFadeOutFrames={isLast ? 0 : TRANSITION_FRAMES}
            />
          </TransitionSeries.Sequence>,
        ];

        if (!isLast) {
          items.push(
            <TransitionSeries.Transition
              key={`transition-${index}`}
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
            />,
          );
        }

        return items;
      })}
    </TransitionSeries>
  );
};
