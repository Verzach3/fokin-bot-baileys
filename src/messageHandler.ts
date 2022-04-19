import makeWASocket, {
  downloadContentFromMessage,
  proto,
} from "@adiwajshing/baileys";
import { statSync } from "fs";
import { writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { convertMp4ToWebp } from "./lib/convertMp4ToWebp";

export async function messageHandler(
  messages: proto.IWebMessageInfo[],
  sock: any
) {
  const m = messages[0];
  if (!m.message) return;
  const messageType = Object.keys(m.message)[0];

  const buttons = [
    { buttonId: "id1", buttonText: { displayText: "Button 1" }, type: 1 },
    { buttonId: "id2", buttonText: { displayText: "Button 2" }, type: 1 },
    { buttonId: "id3", buttonText: { displayText: "Button 3" }, type: 1 },
  ];

  const buttonMessage = {
    text: "Hi it's button message",
    footer: "Hello World",
    buttons: buttons,
    headerType: 1,
  };

  if (m.message.conversation === "!buttontest") {
    sock.sendMessage(m.key.remoteJid, buttonMessage);
  }

  // send a list message!
  const sections = [
    {
      title: "Section 1",
      rows: [
        { title: "Option 1", rowId: "option1" },
        {
          title: "Option 2",
          rowId: "option2",
          description: "This is a description",
        },
      ],
    },
    {
      title: "Section 2",
      rows: [
        { title: "Option 3", rowId: "option3" },
        {
          title: "Option 4",
          rowId: "option4",
          description: "This is a description V2",
        },
      ],
    },
  ];

  const listMessage = {
    text: "This is a list",
    footer: "nice footer, link: https://google.com",
    title: "Amazing boldfaced list title",
    buttonText: "Required, text on the button to view the list",
    sections,
  };

  if (m.message.conversation === "!listtest") {
    sock.sendMessage(m.key.remoteJid, listMessage);
  }

  const reactionMessage = {
    react: {
      text: "❤️",
      key: m.key,
    },
  };
  if (m.message.conversation === "!reactiontest") {
    await sock.sendMessage(m.key.remoteJid, reactionMessage);
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
        .webp({ quality: 5 })
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
