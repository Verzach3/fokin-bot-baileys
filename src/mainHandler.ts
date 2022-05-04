import {
  AnyMessageContent,
  AppStateChunk,
  AuthenticationCreds,
  BaileysEventEmitter,
  BaileysEventMap,
  BinaryNode,
  CatalogCollection,
  ChatModification,
  ConnectionState,
  Contact,
  GroupMetadata,
  MediaConnInfo,
  MessageReceiptType,
  MessageRelayOptions,
  MiscMessageGenerationOptions,
  OrderDetails,
  ParticipantAction,
  Product,
  ProductCreate,
  ProductUpdate,
  proto,
  SignalKeyStoreWithTransaction,
  WABusinessProfile,
  WAMediaUpload,
  WAMediaUploadFunction,
  WAPatchCreate,
  WAPatchName,
  WAPresence,
} from "@adiwajshing/baileys";
import { randomNumber as randomNumberHandler } from "./handlers/randomGeneratorHandler";
import { ytDownloadHandler } from "./handlers/ytDownloadHandler";
import { stickerHandler } from "./handlers/stickerHandler";
import { banHandler } from "./banHandler";
import { infoHandler } from "./handlers/infoHandler";
import { helpHandler } from "./handlers/helpHandler";
import { mathHandler } from "./handlers/mathHandler";
import { booksHandler } from "./handlers/booksHandler";
import levelup from "levelup";
import { LevelDown } from "leveldown";
import { AbstractIterator } from "abstract-leveldown";
import sock from "./interfaces/sock";

export async function mainHandler(
  messages: proto.IWebMessageInfo[],
  sock: sock,
  db: levelup.LevelUp<LevelDown, AbstractIterator<any, any>>,
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
  const debug = false; // Deshabilita los comandos
  const m = messages[0];
  if (!m.message) {
    console.log("[No message]");
    return;
  }
  if (m.key.fromMe) return;
  const chatId = m.key.remoteJid;
  const senderId = m.key.participant;
  const message = m.message?.conversation;
  const messageType = Object.keys(m.message)[0];
  const splitMessage = m.message?.conversation?.split(" ") || [];
  const splitMessageForBooks = m.message?.conversation?.split(",") || [];
  const splitExtendedMessage =
    m.message?.extendedTextMessage?.text?.split(" ") || [];
  const groupMetadata: GroupMetadata = m.key.participant === undefined ? null as any :await sock.groupMetadata!(chatId!)
  function commandCheck(command: string) {
    if (splitMessage[0] === command) return true;
    if (splitExtendedMessage[0] === command) return true;
    if (m.message?.imageMessage?.caption === command) return true;
    return false;
  }
  function checkAdmin() {
    if (
      groupMetadata.participants.find(
        (member) =>
          member.id === senderId &&
          (member.admin === "admin" || member.admin === "superadmin")
      )
    )
      return true;
    return false;
  }

  if (commandCheck("!returnDebug")) {
    sendTextMessage(chatId!, JSON.stringify(m));
  }

  if (commandCheck("!warn")) {
    let warns = 0 
    try {
      parseInt((await db.get(m.key.remoteJid!+m.message.extendedTextMessage!.contextInfo!.mentionedJid!+"_warns")).toString()) 
    } catch (error) {
      console.log(error)
    }
    if (!checkAdmin()) return;
    if (warns >= 3) {
      await db.del(m.key.remoteJid!+m.message.extendedTextMessage!.contextInfo!.mentionedJid+"_warns");
      sendTextMessage(m.pushName!, "Ha sido expulsado del grupo");
      await sock.groupParticipantsUpdate!(chatId!, [...m.message.extendedTextMessage!.contextInfo!.mentionedJid!], "remove");
      return;
    }
    else{
      await db.put(m.key.remoteJid!+m.message.extendedTextMessage!.contextInfo!.mentionedJid!+"_warns", (warns+1).toString());
      sendTextMessage(chatId!, `Has sido advertido ${warns + 1}/3 veces`);
  }
  }

  console.log(`${commandCheck("/start") ? "[YESSSSSSSS]" : "[NOOOOOOO]" }`);

  console.log(
    `[${chatId} - MESSAGE]`,
    message!,
    splitExtendedMessage!.join(" ")
  );

  if (commandCheck("!disable") && checkAdmin()) {
    if (splitMessage[1] === "!stick") {
      db.put(`${chatId}_stick`, "false");
      sendTextMessage(chatId!, "Se ha deshabilitado el comando !stick");
    }
  } else if (commandCheck("!disable") && !checkAdmin()) {
    sendTextMessage(
      chatId!,
      "Solo los administradores pueden deshabilitar los comandos"
    );
  }

  if (commandCheck("!enable") && checkAdmin()) {
    if (splitMessage[1] === "!stick") {
      db.put(`${chatId}_stick`, "true");
      sendTextMessage(chatId!, "Se ha habilitado el comando !stick");
    }
  } else if (commandCheck("!enable") && !checkAdmin()) {
    sendTextMessage(
      chatId!,
      "Solo los administradores pueden habilitar los comandos"
    );
  }
  if (debug) return;
  // Handler === Manejador, Reciben y responden mensajes
  // Desde aqui comienzan los handlers
  booksHandler(splitMessageForBooks, chatId, sock);
  mathHandler(splitMessage, sendTextMessage, chatId);

  //Help Screen
  helpHandler(m, sendTextMessage, chatId);

  if (splitMessage[0] === "!report") {
    sendTextMessage(
      "573135408570@s.whatsapp.net",
      splitMessage.toString() + `[FROM] ${chatId}`
    );
  }

  infoHandler(splitMessage, sendTextMessage, chatId);

  randomNumberHandler(m, sock);
  ytDownloadHandler(
    splitMessage,
    chatId,
    sock,
    splitExtendedMessage,
    sendTextMessage,
    sendVideoMessage,
    sendAudioMessage
  );

  if (commandCheck("!admin?")) {
    checkAdmin()
      ? sendTextMessage(chatId!, "Si")
      : sendTextMessage(chatId!, "No");
  }

  async function keyCheck(key: string, command: string) {
    try {
      return (await db.get(`${key}_${command}`)).toString();
    } catch (error) {
      return "not set";
    }
  }

  //!stick
  console.log("[KEYCHECK - STICK] ", await keyCheck(chatId!, "stick"));
  if ((await keyCheck(chatId!, "stick")) === "false" && commandCheck("!stick")) {
    sendTextMessage(chatId!, "Stickers deshabilitados");
  } else {
    console.log("[EXECUTED - STICK] ");
    stickerHandler(m, messageType, sendStickerMessage, chatId, sendTextMessage);
  }

  if (splitExtendedMessage[0] === "!ban") {
    console.log("[BAN]");
    banHandler(sock, chatId, senderId, m, messages, sendTextMessage);
  }
}