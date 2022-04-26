import { proto } from "@adiwajshing/baileys";
import { imageStickerGenerator } from "../lib/imageStickerGenerator";
import { videoStickerGenerator } from "../lib/videoStickerGenerator";

export async function stickerHandler(
  m: proto.IWebMessageInfo,
  messageType: string,
  sendStickerMessage: (contactId: string, stickerPath: string) => void,
  sender: string | null | undefined,
  sendTextMessage: (contactId: string, message: string) => void
) {
  console.log("[stickerHandler]");
  if (m.message!.imageMessage?.caption === "!stick") {
    if (messageType === "imageMessage") {
      // download stream
      console.log("[STICKER]");
      await imageStickerGenerator(m, sender!, sendStickerMessage);
    }
  }
  if (m.message!.videoMessage?.caption === "!stick") {
    if (messageType === "videoMessage") {
      console.log("[STICKER - ANIMATED]");
      await videoStickerGenerator(
        m,
        sendStickerMessage,
        sender,
        sendTextMessage
      );
    }
  }
}
