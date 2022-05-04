import ff from "fluent-ffmpeg";

export async function convertVideoToMp3(path: string, expath: string) {
  await new Promise((resolve, reject) => {
    ff(path)
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions(["-b:a", "192K", "-vn" ]).toFormat('mp3').save(expath);
  });
}
