import { Scene, SceneProps } from "./Scene";
import { Scene4Graphic } from "../graphics/Scene4Graphic";

type Props = Omit<
  SceneProps,
  "videoSrc" | "audioSrc" | "captionsSrc" | "graphic"
>;

/**
 * Scene 4: public/prevu4.mp4 (muted) + public/audio-prevu-4.wav voice-over
 * + public/captions-prevu-4.json animated captions + budget checklist graphic.
 */
export const Scene4: React.FC<Props> = (props) => {
  return (
    <Scene
      videoSrc="prevu4.mp4"
      audioSrc="audio-prevu-4.wav"
      captionsSrc="captions-prevu-4.json"
      graphic={<Scene4Graphic />}
      {...props}
    />
  );
};
