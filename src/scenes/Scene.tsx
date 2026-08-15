import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { AnimatedCaptions } from "../captions/AnimatedCaptions";
import { LoopingVideo } from "./LoopingVideo";

export type SceneProps = {
  /** Filename in public/, e.g. "prevu1.mp4" */
  videoSrc: string;
  /** Filename in public/, e.g. "audio-prevu-1.wav" */
  audioSrc: string;
  /** Filename in public/, e.g. "captions-prevu-1.json" */
  captionsSrc: string;
  /** Native duration of the video file, in seconds, used to loop it seamlessly. */
  videoDurationInSeconds: number;
  /** This scene's own duration (= its voice-over's duration), in frames. */
  durationInFrames: number;
  /** Frames to fade the voice-over in at the start (0 for the first scene). */
  audioFadeInFrames?: number;
  /** Frames to fade the voice-over out at the end (0 for the last scene). */
  audioFadeOutFrames?: number;
  /** Optional animated motion-graphic overlay specific to this scene. */
  graphic?: React.ReactNode;
};

/**
 * A single scene: a muted background video (looped to fill the scene),
 * the voice-over as the only audible track, an optional motion-graphic
 * overlay, and word-by-word animated captions synced to the voice-over.
 */
export const Scene: React.FC<SceneProps> = ({
  videoSrc,
  audioSrc,
  captionsSrc,
  videoDurationInSeconds,
  durationInFrames,
  audioFadeInFrames = 0,
  audioFadeOutFrames = 0,
  graphic,
}) => {
  const { fps } = useVideoConfig();
  const videoDurationInFrames = Math.round(videoDurationInSeconds * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <LoopingVideo
        videoSrc={videoSrc}
        nativeDurationInFrames={videoDurationInFrames}
        totalDurationInFrames={durationInFrames}
      />
      <SceneAudio
        audioSrc={audioSrc}
        durationInFrames={durationInFrames}
        fadeInFrames={audioFadeInFrames}
        fadeOutFrames={audioFadeOutFrames}
      />
      {graphic}
      <AnimatedCaptions captionsSrc={captionsSrc} />
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{
  audioSrc: string;
  durationInFrames: number;
  fadeInFrames: number;
  fadeOutFrames: number;
}> = ({ audioSrc, durationInFrames, fadeInFrames, fadeOutFrames }) => {
  return (
    <Audio
      src={staticFile(audioSrc)}
      volume={(frame) => {
        const fadeIn =
          fadeInFrames > 0
            ? interpolate(frame, [0, fadeInFrames], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

        const fadeOut =
          fadeOutFrames > 0
            ? interpolate(
                frame,
                [durationInFrames - fadeOutFrames, durationInFrames],
                [1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )
            : 1;

        return Math.min(fadeIn, fadeOut);
      }}
    />
  );
};
