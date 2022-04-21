import makeWASocket, { SocketConfig, useSingleFileAuthState } from "@adiwajshing/baileys";

export default class fokinBot{
  sock = makeWASocket({});
  constructor(config: Partial<SocketConfig>){
    this.sock = makeWASocket({...config});
  }

    



}