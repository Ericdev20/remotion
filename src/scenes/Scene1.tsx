import { Scene, SceneProps } from "./Scene";
import { Scene1Graphic } from "../graphics/Scene1Graphic";

type Props = Omit<
  SceneProps,
  "videoSrc" | "audioSrc" | "captionsSrc" | "graphic"
>;

/**
 * Scene 1: public/prevu1.mp4 (muted) + public/audio-prevu-1.wav voice-over
 * + public/captions-prevu-1.json animated captions + hook motion graphic.
 */
export const Scene1: React.FC<Props> = (props) => {
  return (
    <Scene
      videoSrc="prevu1.mp4"
      audioSrc="audio-prevu-1.wav"
      captionsSrc="captions-prevu-1.json"
      graphic={<Scene1Graphic />}
      {...props}
    />
  );
};
