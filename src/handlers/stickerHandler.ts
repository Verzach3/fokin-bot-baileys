import { proto } from "@adiwajshing/baileys";
import { videoStickerGenerator } from "../lib/videoStickerGenerator";

export async function stickerHandler(m: proto.IWebMessageInfo, messageType: string, sendStickerMessage: (contactId: string, stickerPath: string) => void, sender: string | null | undefined, sendTextMessage: (contactId: string, message: string) => void) {
  if (m.message!.videoMessage?.caption === "!stick") {
    if (messageType === "videoMessage") {
      await videoStickerGenerator(m, sendStickerMessage, sender, sendTextMessage);
    }
  }
}
