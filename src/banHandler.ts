import { GroupMetadata, proto } from "@adiwajshing/baileys";
import { nanoid } from "nanoid";

export async function banHandler(sock: any, chatId: string | null | undefined, senderId: string | null | undefined, m: proto.IWebMessageInfo, messages: proto.IWebMessageInfo[], sendTextMessage: (contactId: string, message: string) => void) {
  const groupMetadata: GroupMetadata = await sock.groupMetadata(chatId);
  const member = groupMetadata.participants.find(
    (member) => member.id === senderId &&
      (member.admin === "admin" || member.admin === "superadmin")
  );
  let membertoban = groupMetadata.participants.find(
    (member) => member.id === m.message!.extendedTextMessage?.contextInfo?.mentionedJid![0]! &&
      (member.admin !== "admin" && member.admin !== "superadmin")
  );
  if (!membertoban) {
    membertoban = groupMetadata.participants.find(
      (member) => member.id === m.message!.extendedTextMessage?.contextInfo?.participant![0]! &&
        (member.admin !== "admin" && member.admin !== "superadmin")
    );
  }
  if (!membertoban) {
    sendTextMessage(chatId!, "No se encontró al usuario a banear");
    return;
  };
  console.log(groupMetadata.participants);
  console.log(member);
  if ((m.message!.extendedTextMessage?.contextInfo?.mentionedJid![0]! || m.message!.extendedTextMessage?.contextInfo?.participant || nanoid()) !==
    senderId &&
    member!) {
    if (membertoban.admin === "admin") {
      sendTextMessage(chatId!, "La persona que se intenta banear es un administrador!\nTienes Que Hacerlo manualmente");
      return
    }
    sock.groupParticipantsUpdate(messages[0].key.remoteJid, [...m.message!.extendedTextMessage?.contextInfo?.participant!], "remove");
    sock.groupParticipantsUpdate(messages[0].key.remoteJid, [...m.message!.extendedTextMessage?.contextInfo?.mentionedJid!], "remove");
    sendTextMessage(chatId!, "Usuario baneado");
  }
}
