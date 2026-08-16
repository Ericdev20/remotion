import { staticFile } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { webReader } from "@remotion/media-parser/web";

/** Real duration of a video file in `public/`, rounded to frames at the given fps. */
export const getVideoDurationInFrames = async (
  videoSrc: string,
  fps: number,
) => {
  const { slowDurationInSeconds } = await parseMedia({
    src: staticFile(videoSrc),
    reader: webReader,
    fields: { slowDurationInSeconds: true },
    acknowledgeRemotionLicense: true,
  });

  return Math.round(slowDurationInSeconds * fps);
};
