import { Scene, SceneProps } from "./Scene";
import { Scene2Graphic } from "../graphics/Scene2Graphic";

type Props = Omit<
  SceneProps,
  "videoSrc" | "audioSrc" | "captionsSrc" | "graphic"
>;

/**
 * Scene 2: public/prevu2.mp4 (muted) + public/audio-prevu-2.wav voice-over
 * + public/captions-prevu-2.json animated captions + contrast motion graphic.
 */
export const Scene2: React.FC<Props> = (props) => {
  return (
    <Scene
      videoSrc="prevu2.mp4"
      audioSrc="audio-prevu-2.wav"
      captionsSrc="captions-prevu-2.json"
      graphic={<Scene2Graphic />}
      {...props}
    />
  );
};
