import { downloadContentFromMessage, proto } from "@adiwajshing/baileys";
import { statSync } from "fs";
import { writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { convertMp4ToWebp } from "./convertMp4ToWebp";

export async function videoStickerGenerator(
  m: proto.IWebMessageInfo,
  sendStickerMessage: (contactId: string, stickerPath: string) => void,
  sender: string | null | undefined,
  sendTextMessage: (contactId: string, message: string) => void,
  mentioned?: boolean
) {
  const filename = nanoid();
  let stream = null;
  // download stream
  if (mentioned) {
    stream = await downloadContentFromMessage(
      m.message!.extendedTextMessage!.contextInfo!.quotedMessage!
        .videoMessage! as any,
      "video"
    );
  } else {
    stream = await downloadContentFromMessage(
      m.message!.videoMessage as any,
      "video"
    );
  }
  if (!stream) {
    console.log("[No stream]");
    return;
  }
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  // save to file
  await writeFile(`./media/${filename}.mp4`, buffer);
  await convertMp4ToWebp(
    `./media/${filename}.mp4`,
    `./media/${filename}-1.webp`
  );
  await sharp(`./media/${filename}-1.webp`, { animated: true })
    .resize({ width: 512, height: 512 })
    .webp({ quality: 80 })
    .toFile(`./media/${filename}.webp`);
  if (statSync(`./media/${filename}.webp`).size < 1000000) {
    sendStickerMessage(sender!, `./media/${filename}.webp`);
  } else {
    sendTextMessage(sender!, "Sticker demasiado pesado");
  }
}
