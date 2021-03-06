import makeWASocket, {
  DisconnectReason,
  proto,
  useSingleFileAuthState,
} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import { mkdir } from "fs";
import LevelDOWN from "leveldown";
import levelup from "levelup";
import { button } from "./interfaces/button";
import { mainHandler } from "./mainHandler";

const { state, saveState } = useSingleFileAuthState("./auth.json");
const db = levelup(LevelDOWN("./db"));
let startLog = false;
mkdir("./media", (err) => console.log(err));

async function connectToWhatsapp() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  const sendTextMessage = async (contactId: string, message: string) => {
    sock.sendMessage(contactId, { text: message });
  };

  const sendVideoMessage = async (
    contactId: string,
    videoPath: string,
    caption?: string
  ) => {
    sock.sendMessage(contactId, {
      video: { url: videoPath },
      caption: caption,
    });
  };

  const sendAudioMessage = async (contactId: string, audioPath: string) => {
    sock.sendMessage(contactId, {
      audio: { url: audioPath },
      mimetype: "audio/mp4",
    });
  };

  const sendImageMessage = async (
    contactId: string,
    imagePath: string,
    caption?: string
  ) => {
    sock.sendMessage(contactId, {
      image: { url: imagePath },
      caption: caption,
    });
  };

  const sendStickerMessage = async (contactId: string, stickerPath: string) => {
    sock.sendMessage(contactId, { sticker: { url: stickerPath } });
  };

  const sendButtonMessage = async (
    contactId: string,
    buttons: proto.IButton[],
    caption: string,
    footer: string,
    imagePath: string
  ) => {
    sock.sendMessage(contactId, {
      image: { url: imagePath! },
      caption: caption,
      footer: footer,
      buttons: buttons,
    });
  };

  // Make connection
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect!.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to error ",
        // lastDisconnect!.error,
        ", reconnecting ",
        shouldReconnect
      );
      if (shouldReconnect) {
        connectToWhatsapp();
      }
    } else if (connection === "open") {
      console.log("Connection opened");
      if (startLog) {
        sendTextMessage("573135408570@s.whatsapp.net", "Bot Started");
      }
    }
  });

  // Update credentials
  sock.ev.on("creds.update", saveState);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      console.log("[MESSAGE FROM]", messages[0]); // sender
      console.log(messages[0]); // message
      mainHandler(
        messages,
        sock as any,
        db,
        sendTextMessage,
        sendVideoMessage,
        sendAudioMessage,
        sendImageMessage,
        sendStickerMessage,
        sendButtonMessage
      );
    } catch (error) {
      console.log("[POSIBLY FATAL ERROR]", error);
    }
  });

  sock.ev.on("group-participants.update", (participants) => {
    if (participants.action === "add") {
      sock.groupMetadata(participants.id).then(console.log);
    }
    console.log("New Group Participants", participants);
  });
}
connectToWhatsapp();
