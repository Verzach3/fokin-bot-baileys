import { createWriteStream } from "fs";
import { nanoid } from "nanoid";
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";

const IT = require("youtubei.js");

export async function dlVideo(
  link: string,
  senderId: string,
  sendTextMessage: (contactId: string, message: string) => void,
  sendVideoMessage: (
    contactId: string,
    videoPath: string,
    caption?: string | undefined
  ) => void,
  sendAudioMessage: (contactId: string, audioPath: string) => void
) {
  const youtube = await new IT();

  if (ytdl.validateURL(link)) {
    const filename = nanoid();
    const videoId = ytdl.getURLVideoID(link);
    const video: any = await youtube.getDetails(videoId);
    const videoLength = (await ytdl.getBasicInfo(link)).videoDetails
      .lengthSeconds;
    if (parseInt(videoLength) > 600) {
      sendTextMessage(senderId, "Video demasiado largo, limite 10min");
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
          try {
            process.stdout.cursorTo(0);
          } catch (error) {}
          if (info.percentage % 10 === 0) {
            // process.stdout.write(
            //   `[DOWNLOADER] Downloaded ${info.percentage}% (${info.downloaded_size}MB) of ${info.size}MB`
            // );
          }
        }
      );

      stream.on("end", async () => {
        try {
          process.stdout.cursorTo(0);
        } catch (error) {}
        console.info("[DOWNLOADER]", "Done!");
        sendVideoMessage(senderId, `./media/${filename}.mp4`, video.title);
      });

      stream.on("error", (err: any) => {
        console.error("[ERROR]", err);
      });
    }
    console.log(video);
  }
}

export async function dlAudio(
  link: string,
  senderId: string,
  sendTextMessage: (contactId: string, message: string) => void,
  sendAudioMessage: (contactId: string, audioPath: string) => void
) {
  const youtube = await new IT();

  if (ytdl.validateURL(link)) {
    const filename = nanoid();
    const videoId = ytdl.getURLVideoID(link);
    const video: any = await youtube.getDetails(videoId);
    const videoLength = (await ytdl.getBasicInfo(link)).videoDetails
      .lengthSeconds;
    if (parseInt(videoLength) > 600) {
      sendTextMessage(senderId, "Video demasiado largo, limite 10min");
      console.log("Video demasiado largo");
      return null;
    } else {
      const stream = youtube.download(videoId, {
        format: "mp4",
        quality: "360p",
        type: "audio",
      });
      stream.pipe(createWriteStream(`./media/${filename}.aac`));

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
          try {
            process.stdout.cursorTo(0);
          } catch (error) {}
          if (info.percentage % 10 === 0) {
            // process.stdout.write(
            //   `[DOWNLOADER] Downloaded ${info.percentage}% (${info.downloaded_size}MB) of ${info.size}MB`
            // );
          }
        }
      );

      stream.on("end", async () => {
        try {
          process.stdout.cursorTo(0);
        } catch (error) {}
        console.info("[DOWNLOADER]", "Done!");
        console.log(video);
        sendAudioMessage(senderId, `./media/${filename}.aac`);
      });

      stream.on("error", (err: any) => console.error("[ERROR]", err));
    }
  }
}
