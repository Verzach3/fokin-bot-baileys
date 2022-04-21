import makeWASocket, { GroupMetadata, proto } from "@adiwajshing/baileys";
import { randomNumber as randomNumberHandler } from "./handlers/randomGeneratorHandler";
import { imageStickerGenerator } from "./lib/imageStickerGenerator";
import { ytDownloadHandler } from "./handlers/ytDownloadHandler";
import { stickerHandler } from "./handlers/stickerHandler";
import { nanoid } from "nanoid";

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
  const chatId = m.key.remoteJid;
  const groupId = m.key.remoteJid?.split("-")[1] || "";
  console.log(groupId);
  const senderId = m.key.participant
  const messageType = Object.keys(m.message)[0];
  const splitMessage = m.message?.conversation?.split(" ") || "";
  const splitExtendedMessage =
    m.message?.extendedTextMessage?.text?.split(" ") || "";
  if (m.message?.conversation === "!comandos") {
    sendTextMessage(
      chatId!,
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
  ytDownloadHandler(
    splitMessage,
    chatId,
    sock,
    splitExtendedMessage,
    sendTextMessage,
    sendVideoMessage
  );
  await stickerHandler(
    m,
    messageType,
    sendStickerMessage,
    chatId,
    sendTextMessage
  );

  if (splitExtendedMessage[0] === "!ban") {
    const groupMetadata: GroupMetadata = await sock.groupMetadata(chatId);
    const member = groupMetadata.participants.find(
      (member) =>
        member.id === senderId &&
        (member.admin === "admin" || member.admin === "superadmin")
    );
    console.log(groupMetadata.participants);
    console.log(member);
    if (
      (m.message.extendedTextMessage?.contextInfo?.mentionedJid || m.message.extendedTextMessage?.contextInfo?.participant ||nanoid()) !==
      senderId &&
      member!
    ) {
      
      sock.groupParticipantsUpdate(messages[0].key.remoteJid, [...m.message.extendedTextMessage?.contextInfo?.mentionedJid!, m.message.extendedTextMessage?.contextInfo?.participant ], "remove")
      sendTextMessage(chatId!, "🚫");
    }
  }
}
