import makeWASocket, {
  DisconnectReason,
  useSingleFileAuthState,
} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import { mkdir } from "fs";
import { messageHandler } from "./messageHandler";

const { state, saveState } = useSingleFileAuthState("./auth.json");

mkdir("./media", (err) => console.log(err));

async function connectToWhatsapp() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

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
    }
  });

  // Update credentials
  sock.ev.on("creds.update", saveState);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    console.log("New Messages", messages);
    messageHandler(messages, sock);
  });

  sock.ev.on("chats.update", async (chats) => {
    console.log("New Chats", chats);
  });
}
connectToWhatsapp();
