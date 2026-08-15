import { Scene, SceneProps } from "./Scene";
import { Scene5Graphic } from "../graphics/Scene5Graphic";

type Props = Omit<
  SceneProps,
  "videoSrc" | "audioSrc" | "captionsSrc" | "graphic"
>;

/**
 * Scene 5: public/prevu5.mp4 (muted) + public/audio-prevu-5.wav voice-over
 * + public/captions-prevu-5.json animated captions + goal-ring payoff graphic.
 */
export const Scene5: React.FC<Props> = (props) => {
  return (
    <Scene
      videoSrc="prevu5.mp4"
      audioSrc="audio-prevu-5.wav"
      captionsSrc="captions-prevu-5.json"
      graphic={<Scene5Graphic durationInFrames={props.durationInFrames} />}
      {...props}
    />
  );
};
