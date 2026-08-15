import { Scene, SceneProps } from "./Scene";
import { Scene6Graphic } from "../graphics/Scene6Graphic";

type Props = Omit<
  SceneProps,
  "videoSrc" | "audioSrc" | "captionsSrc" | "graphic"
>;

/**
 * Scene 6: public/prevu6.mp4 (muted) + public/audio-prevu-6.wav voice-over
 * + public/captions-prevu-6.json animated captions + price/CTA graphic.
 */
export const Scene6: React.FC<Props> = (props) => {
  return (
    <Scene
      videoSrc="prevu6.mp4"
      audioSrc="audio-prevu-6.wav"
      captionsSrc="captions-prevu-6.json"
      graphic={<Scene6Graphic />}
      {...props}
    />
  );
};
