import makeWASocket, {
  proto,
} from "@adiwajshing/baileys";
import { randomNumber as randomNumberHandler } from "./handlers/randomGeneratorHandler";
import { imageStickerGenerator } from "./lib/imageStickerGenerator";
import { ytDownloadHandler } from "./handlers/ytDownloadHandler";
import { stickerHandler } from "./handlers/stickerHandler";

export async function mainHandler(
  messages: proto.IWebMessageInfo[],
  sock: any,
  sendTextMessage: (contactId: string, message: string) => void,
  sendVideoMessage: (
    contactId: string,
    videoPath: string,
    caption?: string
  ) => void,
  sendAudioMessage: (contactId: string, audioPath: string) => void,
  sendImageMessage: (
    contactId: string,
    imagePath: string,
    caption?: string
  ) => void,
  sendStickerMessage: (contactId: string, stickerPath: string) => void,
  sendButtonMessage: (
    contactId: string,
    buttons: proto.IButton[],
    caption: string,
    footer: string,
    imagePath: string
  ) => void
) {
  const m = messages[0];
  if (!m.message) return;
  const sender = m.key.remoteJid;
  const messageType = Object.keys(m.message)[0];
  const splitMessage = m.message?.conversation?.split(" ") || "";
  const splitExtendedMessage =
    m.message?.extendedTextMessage?.text?.split(" ") || "";
  if (m.message?.conversation === "!comandos") {
    sendTextMessage(
      sender!,
      "╭──┈ ➤ ✎ 【﻿ＭＥＮＵ】\n" +
        "│\n" +
        "│  ➤ !stick [imagen/gif/video]\n" +
        "│  ➤ !dlvideo [link]\n" +
        "│  ➤ !dlaudio [link]\n" +
        "│  ➤ !info [comando]\n" +
        "│\n" +
        "│【﻿ＧＲＵＰＯＳ】\n" +
        "│  ➤ !ban [@usuario]\n" +
        "│\n" +
        "│\n" +
        "│\n" +
        "│ *Mas en camino!*\n" +
        "╰─────────────❁ཻུ۪۪⸙͎"
    );
  }

  if (m.message.imageMessage?.caption === "!stick") {
    if (messageType === "imageMessage") {
      // download stream
      await imageStickerGenerator(m, sock);
    }
  }

  randomNumberHandler(m, sock);
  ytDownloadHandler(splitMessage, sender, sock, splitExtendedMessage, sendTextMessage, sendVideoMessage);
  await stickerHandler(m, messageType, sendStickerMessage, sender, sendTextMessage);

  if (splitExtendedMessage[0] === "!ban") {
    if (
      m.message.extendedTextMessage?.contextInfo?.mentionedJid !== sender &&
      m.message.extendedTextMessage?.contextInfo?.mentionedJid !== sock.user.id 

    )
    sendTextMessage(sender!, "🚫");
  }
}



