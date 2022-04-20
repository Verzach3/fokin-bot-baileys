import { proto } from "@adiwajshing/baileys";

export function randomNumber(message: proto.IWebMessageInfo, sock: any) {
  const splitMessage = message.message?.conversation?.split(" ");
  console.log(splitMessage);
  if(splitMessage![0] === "!random") {
    const min = parseInt(splitMessage![1]);
    const max = parseInt(splitMessage![2]);
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    sock.sendMessage(message.key.remoteJid, {
      text: `${randomNumber}`,
    });
  }
  // return Math.floor(Math.random() * (max - min + 1)) + min;
}