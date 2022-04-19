import ff from "fluent-ffmpeg";

export async function convertMp4ToWebp(path: string, expath: string) {
  await new Promise((resolve, reject) => {
    ff(path)
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`]).toFormat('webp').save(expath);
  });
}
