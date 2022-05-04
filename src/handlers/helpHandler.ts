import { proto } from "@adiwajshing/baileys";

export function helpHandler(m: proto.IWebMessageInfo, sendTextMessage: (contactId: string, message: string) => void, chatId: string | null | undefined) {
  if (m.message?.conversation === "!comandos") {
    console.log("[Baileys] Help Screen");
    sendTextMessage(
      chatId!,
      "╭──┈ ➤ ✎ 【﻿ＭＥＮＵ】\n" +
      "│\n" +
      "│  ➤ !stick [imagen/gif/video]\n" +
      "│  ➤ !dlvideo [link]\n" +
      "│  ➤ !num [fromD/toD] [número] [base]\n" +
      "│  ➤ !solve [operacion]\n" +
      "│  ➤ !dlaudio [link]\n" +
      "│  ➤ !info [comando]\n" +
      "│  ➤ !report [problema]\n" +
      "│\n" +
      "│【﻿ＧＲＵＰＯＳ】\n" +
      "│  ➤ !ban [@usuario/mencion]\n" +
      "│  ➤ !warn [@usuario/mencion]\n" +
      "│\n" +
      "│\n" +
      "│\n" +
      "│ *Mas en camino!*\n" +
      "╰─────────────❁ཻུ۪۪⸙͎"
    );
  }
}
