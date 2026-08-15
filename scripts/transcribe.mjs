import path from "path";
import fs from "fs";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const to = path.join(process.cwd(), "whisper.cpp");

await installWhisperCpp({
  to,
  version: "1.5.5",
});

await downloadWhisperModel({
  model: "medium",
  folder: to,
});

for (let i = 1; i <= 6; i++) {
  const inputPath = path.join(process.cwd(), "tmp-16k", `audio-prevu-${i}-16k.wav`);
  const whisperCppOutput = await transcribe({
    model: "medium",
    whisperPath: to,
    whisperCppVersion: "1.5.5",
    inputPath,
    tokenLevelTimestamps: true,
    language: "fr",
  });

  const { captions } = toCaptions({ whisperCppOutput });

  const outPath = path.join(process.cwd(), "public", `captions-prevu-${i}.json`);
  fs.writeFileSync(outPath, JSON.stringify(captions, null, 2));
  console.log("Wrote", outPath);
}
