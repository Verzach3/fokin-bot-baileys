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

const libgen = require("libgen");

export async function libGenHandler(
  book: string,
  chatId: string,
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
    getOrderDetails?:
      | ((orderId: string, tokenBase64: string) => Promise<OrderDetails>)
      | undefined;
    getCatalog?:
      | ((
          jid?: string | undefined,
          limit?: number | undefined
        ) => Promise<{ products: Product[] }>)
      | undefined;
    getCollections?:
      | ((
          jid?: string | undefined,
          limit?: number | undefined
        ) => Promise<{ collections: CatalogCollection[] }>)
      | undefined;
    productCreate?: ((create: ProductCreate) => Promise<Product>) | undefined;
    productDelete?:
      | ((productIds: string[]) => Promise<{ deleted: number }>)
      | undefined;
    productUpdate?:
      | ((productId: string, update: ProductUpdate) => Promise<Product>)
      | undefined;
    processMessage?:
      | ((msg: proto.IWebMessageInfo) => Promise<Partial<BaileysEventMap<any>>>)
      | undefined;
    sendMessageAck?:
      | ((
          { tag, attrs }: BinaryNode,
          extraAttrs: { [key: string]: string }
        ) => Promise<void>)
      | undefined;
    sendRetryRequest?: ((node: BinaryNode) => Promise<void>) | undefined;
    appPatch?: ((patchCreate: WAPatchCreate) => Promise<void>) | undefined;
    sendPresenceUpdate?:
      | ((type: WAPresence, toJid?: string | undefined) => Promise<void>)
      | undefined;
    presenceSubscribe?: ((toJid: string) => Promise<void>) | undefined;
    profilePictureUrl?:
      | ((
          jid: string,
          type?: "image" | "preview" | undefined,
          timeoutMs?: number | undefined
        ) => Promise<string>)
      | undefined;
    onWhatsApp?:
      | ((...jids: string[]) => Promise<{ exists: boolean; jid: string }[]>)
      | undefined;
    fetchBlocklist?: (() => Promise<string[]>) | undefined;
    fetchStatus?:
      | ((jid: string) => Promise<{ status: string; setAt: Date }>)
      | undefined;
    updateProfilePicture?:
      | ((jid: string, content: WAMediaUpload) => Promise<void>)
      | undefined;
    updateBlockStatus?:
      | ((jid: string, action: "block" | "unblock") => Promise<void>)
      | undefined;
    getBusinessProfile?:
      | ((jid: string) => Promise<void | WABusinessProfile>)
      | undefined;
    resyncAppState?:
      | ((collections: WAPatchName[]) => Promise<AppStateChunk>)
      | undefined;
    chatModify?:
      | ((mod: ChatModification, jid: string) => Promise<void>)
      | undefined;
    resyncMainAppState?: (() => Promise<void>) | undefined;
    assertSessions?:
      | ((jids: string[], force: boolean) => Promise<boolean>)
      | undefined;
    relayMessage?:
      | ((
          jid: string,
          message: proto.IMessage,
          {
            messageId: msgId,
            participant,
            additionalAttributes,
            cachedGroupMetadata,
          }: MessageRelayOptions
        ) => Promise<string>)
      | undefined;
    sendReceipt?:
      | ((
          jid: string,
          participant: string,
          messageIds: string[],
          type: MessageReceiptType
        ) => Promise<void>)
      | undefined;
    sendReadReceipt?:
      | ((
          jid: string,
          participant: string,
          messageIds: string[]
        ) => Promise<void>)
      | undefined;
    readMessages?: ((keys: proto.IMessageKey[]) => Promise<void>) | undefined;
    refreshMediaConn?:
      | ((forceGet?: boolean | undefined) => Promise<MediaConnInfo>)
      | undefined;
    waUploadToServer?: WAMediaUploadFunction | undefined;
    fetchPrivacySettings?:
      | ((force?: boolean | undefined) => Promise<{ [_: string]: string }>)
      | undefined;
    sendMessage?:
      | ((
          jid: string,
          content: AnyMessageContent,
          options?: MiscMessageGenerationOptions | undefined
        ) => Promise<proto.WebMessageInfo>)
      | undefined;
    groupMetadata?: ((jid: string) => Promise<GroupMetadata>) | undefined;
    groupCreate?:
      | ((subject: string, participants: string[]) => Promise<GroupMetadata>)
      | undefined;
    groupLeave?: ((id: string) => Promise<void>) | undefined;
    groupUpdateSubject?:
      | ((jid: string, subject: string) => Promise<void>)
      | undefined;
    groupParticipantsUpdate?:
      | ((
          jid: string,
          participants: string[],
          action: ParticipantAction
        ) => Promise<string[]>)
      | undefined;
    groupUpdateDescription?:
      | ((jid: string, description?: string | undefined) => Promise<void>)
      | undefined;
    groupInviteCode?: ((jid: string) => Promise<string>) | undefined;
    groupRevokeInvite?: ((jid: string) => Promise<string>) | undefined;
    groupAcceptInvite?: ((code: string) => Promise<string>) | undefined;
    groupAcceptInviteV4?:
      | ((
          jid: string,
          inviteMessage: proto.IGroupInviteMessage
        ) => Promise<string>)
      | undefined;
    groupToggleEphemeral?:
      | ((jid: string, ephemeralExpiration: number) => Promise<void>)
      | undefined;
    groupSettingUpdate?:
      | ((
          jid: string,
          setting: "announcement" | "locked" | "not_announcement" | "unlocked"
        ) => Promise<void>)
      | undefined;
    groupFetchAllParticipating?:
      | (() => Promise<{ [_: string]: GroupMetadata }>)
      | undefined;
    type?: "md" | undefined;
    ws?: any;
    ev?: BaileysEventEmitter | undefined;
    authState?:
      | { creds: AuthenticationCreds; keys: SignalKeyStoreWithTransaction }
      | undefined;
    user?: Contact | undefined;
    emitEventsFromMap?:
      | ((map: Partial<BaileysEventMap<AuthenticationCreds>>) => void)
      | undefined;
    assertingPreKeys?:
      | ((
          range: number,
          execute: (keys: { [_: number]: any }) => Promise<void>
        ) => Promise<void>)
      | undefined;
    generateMessageTag?: (() => string) | undefined;
    query?:
      | ((
          node: BinaryNode,
          timeoutMs?: number | undefined
        ) => Promise<BinaryNode>)
      | undefined;
    waitForMessage?:
      | ((msgId: string, timeoutMs?: number | undefined) => Promise<any>)
      | undefined;
    waitForSocketOpen?: (() => Promise<void>) | undefined;
    sendRawMessage?: ((data: Buffer | Uint8Array) => Promise<void>) | undefined;
    sendNode?: ((node: BinaryNode) => Promise<void>) | undefined;
    logout?: (() => Promise<void>) | undefined;
    end?: ((error: Error) => void) | undefined;
    onUnexpectedError?: ((error: Error, msg: string) => void) | undefined;
    uploadPreKeys?: ((count?: number | undefined) => Promise<void>) | undefined;
    waitForConnectionUpdate?:
      | ((
          check: (u: Partial<ConnectionState>) => boolean,
          timeoutMs?: number | undefined
        ) => Promise<void>)
      | undefined;
  }
) {
  const options = {
    mirror: "http://libgen.is",
    query: book,
    count: 5,
    sort_by: "year",
    reverse: true,
  };

  try {
    const data = await libgen.search(options);

    let n = data.length;
    console.log(`${n} results for "${options.query}"`);
    while (n--) {
      console.log("");
      console.log("Title: " + data[n].title);
      console.log("Author: " + data[n].author);
      console.log("Language: " + data[n].language);
      console.log(
        "Download: " +
          "http://gen.lib.rus.ec/book/index.php?md5=" +
          data[n].md5.toLowerCase()
      );
      try {
        console.log(await libgen.utils.check.canDownload(data[n].md5));
        sock.sendMessage!(chatId, {
          text:
            "*Titulo*: " +
            data[n].title +
            "\n" +
            "*Autor*: " +
            data[n].author +
            "\n",
            footer: data[n].language === "spa"? "Español" : data[n].language + " - " + data[n].extension,
          templateButtons: [
            { index: 1, urlButton: {displayText: "Descargar", url: await libgen.utils.check.canDownload(data[n].md5)} },
          ],
        });
      } catch (error) {}
    }
  } catch (err) {
    console.error(err);
  }
}
