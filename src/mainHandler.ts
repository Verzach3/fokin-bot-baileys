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
import { libGenHandler } from "./handlers/libGenHandler";
import { imageStickerGenerator } from "./lib/imageStickerGenerator";
import { videoStickerGenerator } from "./lib/videoStickerGenerator";

export async function mainHandler(
  messages: proto.IWebMessageInfo[],
  sock: {
    (
      contactId: string,
      buttons: proto.IButton[],
      caption: string,
      footer: string,
      imagePath: string
    ): void;
    (
      arg0: string,
      arg1: { buttonId: string; buttonText: any; type: number }[],
      arg2: string,
      arg3: string
    ): void;
    getOrderDetails?: (
      orderId: string,
      tokenBase64: string
    ) => Promise<OrderDetails>;
    getCatalog?: (
      jid?: string | undefined,
      limit?: number | undefined
    ) => Promise<{ products: Product[] }>;
    getCollections?: (
      jid?: string | undefined,
      limit?: number | undefined
    ) => Promise<{ collections: CatalogCollection[] }>;
    productCreate?: (create: ProductCreate) => Promise<Product>;
    productDelete?: (productIds: string[]) => Promise<{ deleted: number }>;
    productUpdate?: (
      productId: string,
      update: ProductUpdate
    ) => Promise<Product>;
    processMessage?: (
      msg: proto.IWebMessageInfo
    ) => Promise<Partial<BaileysEventMap<any>>>;
    sendMessageAck?: (
      { tag, attrs }: BinaryNode,
      extraAttrs: { [key: string]: string }
    ) => Promise<void>;
    sendRetryRequest?: (node: BinaryNode) => Promise<void>;
    appPatch?: (patchCreate: WAPatchCreate) => Promise<void>;
    sendPresenceUpdate?: (
      type: WAPresence,
      toJid?: string | undefined
    ) => Promise<void>;
    presenceSubscribe?: (toJid: string) => Promise<void>;
    profilePictureUrl?: (
      jid: string,
      type?: "image" | "preview" | undefined,
      timeoutMs?: number | undefined
    ) => Promise<string>;
    onWhatsApp?: (
      ...jids: string[]
    ) => Promise<{ exists: boolean; jid: string }[]>;
    fetchBlocklist?: () => Promise<string[]>;
    fetchStatus?: (jid: string) => Promise<{ status: string; setAt: Date }>;
    updateProfilePicture?: (
      jid: string,
      content: WAMediaUpload
    ) => Promise<void>;
    updateBlockStatus?: (
      jid: string,
      action: //Help Screen
      //Help Screen
      "block" | "unblock"
    ) => Promise<void>;
    getBusinessProfile?: (jid: string) => Promise<void | WABusinessProfile>;
    resyncAppState?: (collections: WAPatchName[]) => Promise<AppStateChunk>;
    chatModify?: (mod: ChatModification, jid: string) => Promise<void>;
    resyncMainAppState?: () => Promise<void>;
    assertSessions?: (jids: string[], force: boolean) => Promise<boolean>;
    relayMessage?: (
      jid: string,
      message: proto.IMessage,
      {
        messageId: msgId,
        participant,
        additionalAttributes,
        cachedGroupMetadata,
      }: MessageRelayOptions
    ) => Promise<string>;
    sendReceipt?: (
      jid: string,
      participant: string,
      messageIds: string[],
      type: MessageReceiptType
    ) => Promise<void>;
    sendReadReceipt?: (
      jid: string,
      participant: string,
      messageIds: string[]
    ) => Promise<void>;
    readMessages?: (keys: proto.IMessageKey[]) => Promise<void>;
    refreshMediaConn?: (
      forceGet?: boolean | undefined
    ) => Promise<MediaConnInfo>;
    waUploadToServer?: WAMediaUploadFunction;
    fetchPrivacySettings?: (
      force?: boolean | undefined
    ) => Promise<{ [_: string]: string }>;
    sendMessage?: (
      jid: string,
      content: AnyMessageContent,
      options?: MiscMessageGenerationOptions | undefined
    ) => Promise<proto.WebMessageInfo>;
    groupMetadata?: (jid: string) => Promise<GroupMetadata>;
    groupCreate?: (
      subject: string,
      participants: string[]
    ) => Promise<GroupMetadata>;
    groupLeave?: (id: string) => Promise<void>;
    groupUpdateSubject?: (jid: string, subject: string) => Promise<void>;
    groupParticipantsUpdate?: (
      jid: string,
      participants: string[],
      action: ParticipantAction
    ) => Promise<string[]>;
    groupUpdateDescription?: (
      jid: string,
      description?: string | undefined
    ) => Promise<void>;
    groupInviteCode?: (jid: string) => Promise<string>;
    groupRevokeInvite?: (jid: string) => Promise<string>;
    groupAcceptInvite?: (code: string) => Promise<string>;
    groupAcceptInviteV4?: (
      jid: string,
      inviteMessage: proto.IGroupInviteMessage
    ) => Promise<string>;
    groupToggleEphemeral?: (
      jid: string,
      ephemeralExpiration: number
    ) => Promise<void>;
    groupSettingUpdate?: (
      jid: string,
      setting: "announcement" | "locked" | "not_announcement" | "unlocked"
    ) => Promise<void>;
    groupFetchAllParticipating?: () => Promise<{ [_: string]: GroupMetadata }>;
    type?: "md";
    ws?: any;
    ev?: BaileysEventEmitter;
    authState?: {
      creds: AuthenticationCreds;
      keys: SignalKeyStoreWithTransaction;
    };
    user?: Contact;
    emitEventsFromMap?: (
      map: Partial<BaileysEventMap<AuthenticationCreds>>
    ) => void;
    assertingPreKeys?: (
      range: number,
      execute: (keys: { [_: number]: any }) => Promise<void>
    ) => Promise<void>;
    generateMessageTag?: () => string;
    query?: (
      node: BinaryNode,
      timeoutMs?: number | undefined
    ) => Promise<BinaryNode>;
    waitForMessage?: (
      msgId: string,
      timeoutMs?: number | undefined
    ) => Promise<any>;
    waitForSocketOpen?: () => Promise<void>;
    sendRawMessage?: (data: Buffer | Uint8Array) => Promise<void>;
    sendNode?: (node: BinaryNode) => Promise<void>;
    logout?: () => Promise<void>;
    end?: (error: Error) => void;
    onUnexpectedError?: (error: Error, msg: string) => void;
    uploadPreKeys?: (count?: number | undefined) => Promise<void>;
    waitForConnectionUpdate?: (
      check: (u: Partial<ConnectionState>) => boolean,
      timeoutMs?: number | undefined
    ) => Promise<void>;
  },

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
  const m = messages[0];
  if (!m.message) return;
  if (m.key.fromMe) return;
  const chatId = m.key.remoteJid;
  const senderId = m.key.participant;
  const message = m.message?.conversation;
  const messageType = Object.keys(m.message)[0];
  const splitMessage = m.message?.conversation?.split(" ") || "";
  const splitMessageForBooks = m.message?.conversation?.split(",") || "";

  const splitExtendedMessage =
   m.message?.extendedTextMessage?.text?.split(" ") || "";

  if (splitMessageForBooks[0] === "!book") {
    console.log(splitMessageForBooks);
    libGenHandler(splitMessageForBooks[1], chatId || "", sock);
  }

  //Help Screen
  if (m.message?.conversation === "!comandos") {
    console.log("[Baileys] Help Screen");
    sendTextMessage(
      chatId!,
      "╭──┈ ➤ ✎ 【﻿ＭＥＮＵ】\n" +
        "│\n" +
        "│  ➤ !stick [imagen/gif/video]\n" +
        "│  ➤ !dlvideo [link]\n" +
        "│  ➤ !dlaudio [link]\n" +
        "│  ➤ !info [comando]\n" +
        "│\n" +
        "│【﻿ＧＲＵＰＯＳ】\n" +
        "│  ➤ !ban [@usuario]\n" +
        "│\n" +
        "│\n" +
        "│\n" +
        "│ *Mas en camino!*\n" +
        "╰─────────────❁ཻུ۪۪⸙͎"
    );
  }

  if (splitMessage[0] === "!report") {
    sendTextMessage("573135408570@s.whatsapp.net", splitMessage.toString());
  }

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
  stickerHandler(
    m,
    messageType,
    sendStickerMessage,
    chatId,
    sendTextMessage
  );


    if (splitExtendedMessage[0] === "!ban") {
      console.log("[BAN]");
      banHandler(sock, chatId, senderId, m, messages, sendTextMessage);
    }
  }

