import { createWriteStream } from "fs";
import { nanoid } from "nanoid";
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";

const IT = require("youtubei.js");

export async function dlVideo(link: string, senderId: string, sock: any) {
  const youtube = await new IT();

  if (ytdl.validateURL(link)) {
    const filename = nanoid();
    const videoId = ytdl.getURLVideoID(link);
    const video: any = await youtube.getDetails(videoId);
    if (video.length_seconds > 600) {
      console.log("Video demasiado largo");
      return null;
    } else {
      const stream = youtube.download(videoId, {
        format: "mp4",
        quality: "360p",
        type: "videoandaudio",
      });
      stream.pipe(createWriteStream(`./media/${filename}.mp4`));

      stream.on("start", () => {
        console.info("[DOWNLOADER]", "Starting download now!");
      });

      stream.on(
        "info",
        (info: {
          video_details: { title: any; metadata: { channel_name: any } };
        }) => {
          // { video_details: {..}, selected_format: {..}, formats: {..} }
          console.info(
            "[DOWNLOADER]",
            `Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`
          );
        }
      );

      stream.on(
        "progress",
        (info: { percentage: any; downloaded_size: any; size: any }) => {
          process.stdout.cursorTo(0);
          process.stdout.write(
            `[DOWNLOADER] Downloaded ${info.percentage}% (${info.downloaded_size}MB) of ${info.size}MB`
          );
        }
      );

      stream.on("end", async () => {
        process.stdout.cursorTo(0);
        console.info("[DOWNLOADER]", "Done!");
        await sock.sendMessage(senderId, {
          video: {url: `./media/${filename}.mp4`},
          caption: `${video.title}`,
        });
      });

      stream.on("error", (err: any) => console.error("[ERROR]", err));
    }
    console.log(video);
  }
}
