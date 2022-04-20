import { proto } from "@adiwajshing/baileys";

export function randomNumber(message: proto.IWebMessageInfo) {
  const messageText = message.message?.conversation;
  console.log(messageText?.split(" "));
  
  // return Math.floor(Math.random() * (max - min + 1)) + min;
}