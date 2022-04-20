import makeWASocket, {
  downloadContentFromMessage,
  proto,
} from "@adiwajshing/baileys";
import { statSync } from "fs";
import { writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { randomNumber } from "./handlers/randomGenerator";
import { convertMp4ToWebp } from "./lib/convertMp4ToWebp";

export async function messageHandler(
  messages: proto.IWebMessageInfo[],
  sock: any
) {
  const m = messages[0];
  if (!m.message) return;
  const messageType = Object.keys(m.message)[0];

  if (m.message?.conversation === "!comandos") {
    sock.sendMessage(
      m.key.remoteJid,{text:
        "*COMANDOS*\n\n" + 
        "*!comandos* - Muestra este mensaje\n" +
        "*!stick* - Genera un sticker con la imagen enviada\n" +
        "*!random [min] [max]* - Genera un numero aleatorio entre los dos numeros\n" +
        "*!ban* - Banea a el usuario mencionado usuario\n" +
        "_requiere permisos de administrador_\n" +
        "*!dlaudio* link - Descarga el audio con el link*\n" +
        "*!dlvideo* link - Descarga el video con el link*\n" +
        "_solamente funciona con links de YouTube_\n" +
        "\n\n*trabajo el progreso"
      }
    );
  }

  if (m.message.imageMessage?.caption === "!stick") {
    if (messageType === "imageMessage") {
      // download stream
      const stream = await downloadContentFromMessage(
        m.message.imageMessage as any,
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
  }

  randomNumber(m, sock)

  if (m.message.videoMessage?.caption === "!stick") {
    // sock.sendMessage(m.key.remoteJid, {sticker: {url: "./kirbi.webp"}});
    if (messageType === "videoMessage") {
      const filename = nanoid();
      // download stream
      const stream = await downloadContentFromMessage(
        m.message.videoMessage as any,
        "video"
      );
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
        .webp({ quality: 20 })
        .toFile(`./media/${filename}.webp`);
      if (statSync(`./media/${filename}.webp`).size < 1000000 ) {
        await sock.sendMessage(m.key.remoteJid, {
          sticker: { url: `./media/${filename}.webp` },
        });
      } else {
        await sock.sendMessage(m.key.remoteJid, { text: "Sticker muy pesado" });
      }
    }
  }
}
