import { OffthreadVideo, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const MAX_CROSSFADE_FRAMES = 12;

type LoopingVideoProps = {
  videoSrc: string;
  /** Native duration of the video file, in frames. */
  nativeDurationInFrames: number;
  /** How long the video needs to fill, in frames. */
  totalDurationInFrames: number;
};

/**
 * Repeats a video to fill `totalDurationInFrames`, cross-dissolving at each
 * loop seam instead of hard-cutting back to frame 0. This avoids the jarring
 * "jump" a plain loop causes on footage with visible motion (e.g. talking).
 */
export const LoopingVideo: React.FC<LoopingVideoProps> = ({
  videoSrc,
  nativeDurationInFrames,
  totalDurationInFrames,
}) => {
  const crossfade = Math.min(
    MAX_CROSSFADE_FRAMES,
    Math.floor(nativeDurationInFrames / 3),
  );

  if (nativeDurationInFrames >= totalDurationInFrames || crossfade <= 0) {
    return <OffthreadVideo src={staticFile(videoSrc)} muted />;
  }

  const step = nativeDurationInFrames - crossfade;
  const repeats = Math.max(
    1,
    Math.ceil((totalDurationInFrames - crossfade) / step),
  );

  return (
    <TransitionSeries>
      {Array.from({ length: repeats }).flatMap((_, index) => {
        const isLast = index === repeats - 1;

        const items = [
          <TransitionSeries.Sequence
            key={`loop-${index}`}
            durationInFrames={nativeDurationInFrames}
          >
            <OffthreadVideo src={staticFile(videoSrc)} muted />
          </TransitionSeries.Sequence>,
        ];

        if (!isLast) {
          items.push(
            <TransitionSeries.Transition
              key={`loop-transition-${index}`}
              presentation={fade()}
              timing={linearTiming({ durationInFrames: crossfade })}
            />,
          );
        }

        return items;
      })}
    </TransitionSeries>
  );
};
