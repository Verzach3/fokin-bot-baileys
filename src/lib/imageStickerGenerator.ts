import {
  downloadContentFromMessage,
  proto
} from "@adiwajshing/baileys";
import { writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import sharp from "sharp";

export async function imageStickerGenerator(m: proto.IWebMessageInfo, sock: any) {
  const stream = await downloadContentFromMessage(
    m.message!.imageMessage as any,
    "image"
  );
  const filename = nanoid();
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  // save to file
  await writeFile(`./media/${filename}.jpeg`, buffer);
  await sharp(`./media/${filename}.jpeg`, { animated: true })
    .resize({ width: 512, height: 512 })
    .webp({ quality: 100 })
    .toFile(`./media/${filename}.webp`);
  await sock.sendMessage(m.key.remoteJid, {
    sticker: { url: `./media/${filename}.webp` },
  });
}
