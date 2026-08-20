import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedCaptions } from "./captions/AnimatedCaptions";

export type Beat = {
  /** When this beat's motion graphic starts, in ms, relative to the video. */
  fromMs: number;
  /** The graphic to show for this beat. Receives the beat's own duration
   * (in frames) for graphics that need to time an internal animation
   * against how long they'll be on screen (e.g. a progress bar). */
  graphic: (durationInFrames: number) => React.ReactNode;
};

export type ZoomKeyframe = {
  /** Position in the video, in ms. */
  ms: number;
  /** Scale to reach by this point (1 = no zoom). */
  scale: number;
};

export type Outro = {
  /** How long the closing card stays on screen, in frames. */
  durationInFrames: number;
  graphic: React.ReactNode;
};

type VideoWithMotionGraphicsProps = {
  /** Filename in public/ of the finished video (picture + final audio mix). */
  videoSrc: string;
  /** Filename in public/ of the word-level caption JSON for this video. */
  captionsSrc: string;
  /** Motion-graphic beats, sorted by `fromMs` ascending, starting at 0. */
  beats: Beat[];
  /** Total composition duration in frames, including the outro if any. */
  durationInFrames: number;
  /** Slow zoom on the video itself, e.g. a push-in during a key beat. */
  zoomKeyframes?: ZoomKeyframe[];
  /** Optional closing card shown after the video ends. */
  outro?: Outro;
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
  zoomKeyframes,
  outro,
}) => {
  const { fps } = useVideoConfig();
  const msToFrames = (ms: number) => Math.round((ms / 1000) * fps);

  const videoDurationInFrames = durationInFrames - (outro?.durationInFrames ?? 0);
  const beatFrames = [
    ...beats.map((b) => msToFrames(b.fromMs)),
    videoDurationInFrames,
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence durationInFrames={videoDurationInFrames} layout="none">
        <ZoomingVideo videoSrc={videoSrc} zoomKeyframes={zoomKeyframes} />
      </Sequence>

      {beats.map((beat, i) => {
        const from = beatFrames[i];
        const beatDurationInFrames = beatFrames[i + 1] - from;

        return (
          <Sequence key={beat.fromMs} from={from} durationInFrames={beatDurationInFrames}>
            <BeatImpact>{beat.graphic(beatDurationInFrames)}</BeatImpact>
          </Sequence>
        );
      })}

      <AnimatedCaptions captionsSrc={captionsSrc} />

      {outro ? (
        <Sequence from={videoDurationInFrames} durationInFrames={outro.durationInFrames}>
          {outro.graphic}
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

const ZoomingVideo: React.FC<{
  videoSrc: string;
  zoomKeyframes?: ZoomKeyframe[];
}> = ({ videoSrc, zoomKeyframes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const scale =
    zoomKeyframes && zoomKeyframes.length > 1
      ? interpolate(
          currentMs,
          zoomKeyframes.map((k) => k.ms),
          zoomKeyframes.map((k) => k.scale),
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo src={staticFile(videoSrc)} />
      </div>
    </AbsoluteFill>
  );
};

/** A brief scale-punch + flash at the start of each beat, so graphics land
 * with a bit more "produced" weight instead of just fading/popping in cold. */
const BeatImpact: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const punch = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 300 },
    durationInFrames: 8,
  });
  const flash = interpolate(frame, [0, 3, 10], [0, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${0.97 + punch * 0.03})` }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: "white", opacity: flash, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
