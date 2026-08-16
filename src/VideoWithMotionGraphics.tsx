import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";
import { AnimatedCaptions } from "./captions/AnimatedCaptions";

export type Beat = {
  /** When this beat's motion graphic starts, in ms, relative to the video. */
  fromMs: number;
  /** The graphic to show for this beat. Receives the beat's own duration
   * (in frames) for graphics that need to time an internal animation
   * against how long they'll be on screen (e.g. a progress bar). */
  graphic: (durationInFrames: number) => React.ReactNode;
};

type VideoWithMotionGraphicsProps = {
  /** Filename in public/ of the finished video (picture + final audio mix). */
  videoSrc: string;
  /** Filename in public/ of the word-level caption JSON for this video. */
  captionsSrc: string;
  /** Motion-graphic beats, sorted by `fromMs` ascending, starting at 0. */
  beats: Beat[];
  /** Total video duration in frames (from calculateMetadata). */
  durationInFrames: number;
};

/**
 * Reusable shell for a finished video (background + final audio) overlaid
 * with word-by-word animated captions and a sequence of motion-graphic
 * "beats" timed to the voice-over. One video = one set of beats/graphics;
 * this component itself doesn't change between videos.
 */
export const VideoWithMotionGraphics: React.FC<VideoWithMotionGraphicsProps> = ({
  videoSrc,
  captionsSrc,
  beats,
  durationInFrames,
}) => {
  const { fps } = useVideoConfig();
  const msToFrames = (ms: number) => Math.round((ms / 1000) * fps);

  const beatFrames = [...beats.map((b) => msToFrames(b.fromMs)), durationInFrames];

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo src={staticFile(videoSrc)} />

      {beats.map((beat, i) => {
        const from = beatFrames[i];
        const beatDurationInFrames = beatFrames[i + 1] - from;

        return (
          <Sequence key={beat.fromMs} from={from} durationInFrames={beatDurationInFrames}>
            {beat.graphic(beatDurationInFrames)}
          </Sequence>
        );
      })}

      <AnimatedCaptions captionsSrc={captionsSrc} />
    </AbsoluteFill>
  );
};
