import ff from "fluent-ffmpeg";

export async function convertAACToMp3(path: string, expath: string) {
  await new Promise((resolve, reject) => {
    ff(path)
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions([`-acodec libmp3lame`]).toFormat('mp3').save(expath);
  });
}
