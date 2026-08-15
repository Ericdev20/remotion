import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { webReader } from "@remotion/media-parser/web";
import { AnimatedCaptions } from "./captions/AnimatedCaptions";
import { Scene1Graphic } from "./graphics/Scene1Graphic";
import { Scene2Graphic } from "./graphics/Scene2Graphic";
import { Scene3Graphic } from "./graphics/Scene3Graphic";
import { Scene4Graphic } from "./graphics/Scene4Graphic";
import { Scene5Graphic } from "./graphics/Scene5Graphic";
import { Scene6Graphic } from "./graphics/Scene6Graphic";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

const VIDEO_SRC = "vid-finale.mov";
const CAPTIONS_SRC = "captions-finale.json";

/**
 * Beat boundaries, in milliseconds, derived from the actual transcript of
 * vid-finale.mov (see public/captions-finale.json). Each beat pairs a
 * segment of the voice-over with a matching motion-graphic overlay.
 */
const BEATS_MS = [0, 5560, 10440, 18720, 28320, 35840];

type Props = {
  durationInFrames: number;
};

const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const video = await parseMedia({
    src: staticFile(VIDEO_SRC),
    reader: webReader,
    fields: { slowDurationInSeconds: true },
    acknowledgeRemotionLicense: true,
  });

  const durationInFrames = Math.round(video.slowDurationInSeconds * FPS);

  return {
    durationInFrames,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    props: { durationInFrames },
  };
};

export const FinalCutComposition = () => {
  return (
    <Composition
      id="MontageFinal"
      component={FinalCutComponent}
      durationInFrames={60}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ durationInFrames: 60 }}
      calculateMetadata={calculateMetadata}
    />
  );
};

const msToFrames = (ms: number) => Math.round((ms / 1000) * FPS);

export const FinalCutComponent: React.FC<Props> = ({ durationInFrames }) => {
  const beatFrames = [...BEATS_MS.map(msToFrames), durationInFrames];

  const beats: { from: number; durationInFrames: number }[] = [];
  for (let i = 0; i < beatFrames.length - 1; i++) {
    beats.push({
      from: beatFrames[i],
      durationInFrames: beatFrames[i + 1] - beatFrames[i],
    });
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo src={staticFile(VIDEO_SRC)} />

      <Sequence from={beats[0].from} durationInFrames={beats[0].durationInFrames}>
        <Scene1Graphic />
      </Sequence>
      <Sequence from={beats[1].from} durationInFrames={beats[1].durationInFrames}>
        <Scene2Graphic />
      </Sequence>
      <Sequence from={beats[2].from} durationInFrames={beats[2].durationInFrames}>
        <Scene3Graphic durationInFrames={beats[2].durationInFrames} />
      </Sequence>
      <Sequence from={beats[3].from} durationInFrames={beats[3].durationInFrames}>
        <Scene4Graphic />
      </Sequence>
      <Sequence from={beats[4].from} durationInFrames={beats[4].durationInFrames}>
        <Scene5Graphic durationInFrames={beats[4].durationInFrames} />
      </Sequence>
      <Sequence from={beats[5].from} durationInFrames={beats[5].durationInFrames}>
        <Scene6Graphic />
      </Sequence>

      <AnimatedCaptions captionsSrc={CAPTIONS_SRC} />
    </AbsoluteFill>
  );
};
