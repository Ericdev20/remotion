import { Scene, SceneProps } from "./Scene";
import { Scene3Graphic } from "../graphics/Scene3Graphic";

type Props = Omit<
  SceneProps,
  "videoSrc" | "audioSrc" | "captionsSrc" | "graphic"
>;

/**
 * Scene 3: public/prevu3.mp4 (muted) + public/audio-prevu-3.wav voice-over
 * + public/captions-prevu-3.json animated captions + "PRÉVU" reveal graphic.
 */
export const Scene3: React.FC<Props> = (props) => {
  return (
    <Scene
      videoSrc="prevu3.mp4"
      audioSrc="audio-prevu-3.wav"
      captionsSrc="captions-prevu-3.json"
      graphic={<Scene3Graphic durationInFrames={props.durationInFrames} />}
      {...props}
    />
  );
};
