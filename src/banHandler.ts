import { GroupMetadata, proto } from "@adiwajshing/baileys";
import { nanoid } from "nanoid";

export async function banHandler(sock: any, chatId: string | null | undefined, senderId: string | null | undefined, m: proto.IWebMessageInfo, messages: proto.IWebMessageInfo[], sendTextMessage: (contactId: string, message: string) => void) {
  const groupMetadata: GroupMetadata = await sock.groupMetadata(chatId);
  const member = groupMetadata.participants.find(
    (member) => member.id === senderId &&
      (member.admin === "admin" || member.admin === "superadmin")
  );
  console.log(groupMetadata.participants);
  console.log(member);
  if ((m.message!.extendedTextMessage?.contextInfo?.mentionedJid || m.message!.extendedTextMessage?.contextInfo?.participant || nanoid()) !==
    senderId &&
    member!) {
    if (member.admin === "admin" || member.admin === "superadmin") {
      sendTextMessage(chatId!, "La persona que intenta banear es un administrador!\nTienes Que Hacerlo manualmente");
      return
    }
    sock.groupParticipantsUpdate(messages[0].key.remoteJid, [...m.message!.extendedTextMessage?.contextInfo?.participant!], "remove");
    sock.groupParticipantsUpdate(messages[0].key.remoteJid, [...m.message!.extendedTextMessage?.contextInfo?.mentionedJid!], "remove");
    sendTextMessage(chatId!, "Usuario baneado");
  }
}
