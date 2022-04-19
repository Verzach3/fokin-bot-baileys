"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHandler = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const nanoid_1 = require("nanoid");
const sharp_1 = __importDefault(require("sharp"));
const convertMp4ToWebp_1 = require("./lib/convertMp4ToWebp");
function messageHandler(messages, sock) {
    var e_1, _a, e_2, _b;
    var _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const m = messages[0];
        if (!m.message)
            return;
        const messageType = Object.keys(m.message)[0];
        const buttons = [
            { buttonId: "id1", buttonText: { displayText: "Button 1" }, type: 1 },
            { buttonId: "id2", buttonText: { displayText: "Button 2" }, type: 1 },
            { buttonId: "id3", buttonText: { displayText: "Button 3" }, type: 1 },
        ];
        const buttonMessage = {
            text: "Hi it's button message",
            footer: "Hello World",
            buttons: buttons,
            headerType: 1,
        };
        if (m.message.conversation === "!buttontest") {
            sock.sendMessage(m.key.remoteJid, buttonMessage);
        }
        const sections = [
            {
                title: "Section 1",
                rows: [
                    { title: "Option 1", rowId: "option1" },
                    {
                        title: "Option 2",
                        rowId: "option2",
                        description: "This is a description",
                    },
                ],
            },
            {
                title: "Section 2",
                rows: [
                    { title: "Option 3", rowId: "option3" },
                    {
                        title: "Option 4",
                        rowId: "option4",
                        description: "This is a description V2",
                    },
                ],
            },
        ];
        const listMessage = {
            text: "This is a list",
            footer: "nice footer, link: https://google.com",
            title: "Amazing boldfaced list title",
            buttonText: "Required, text on the button to view the list",
            sections,
        };
        if (m.message.conversation === "!listtest") {
            sock.sendMessage(m.key.remoteJid, listMessage);
        }
        const reactionMessage = {
            react: {
                text: "❤️",
                key: m.key,
            },
        };
        if (m.message.conversation === "!reactiontest") {
            yield sock.sendMessage(m.key.remoteJid, reactionMessage);
        }
        if (((_c = m.message.imageMessage) === null || _c === void 0 ? void 0 : _c.caption) === "!stickv2") {
            if (messageType === "imageMessage") {
                const stream = yield (0, baileys_1.downloadContentFromMessage)(m.message.imageMessage, "image");
                const filename = (0, nanoid_1.nanoid)();
                let buffer = Buffer.from([]);
                try {
                    for (var stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), !stream_1_1.done;) {
                        const chunk = stream_1_1.value;
                        buffer = Buffer.concat([buffer, chunk]);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (stream_1_1 && !stream_1_1.done && (_a = stream_1.return)) yield _a.call(stream_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                yield (0, promises_1.writeFile)(`./media/${filename}.jpeg`, buffer);
                yield (0, sharp_1.default)(`./media/${filename}.jpeg`, { animated: true })
                    .resize({ width: 512, height: 512 })
                    .webp({ quality: 100 })
                    .toFile(`./media/${filename}.webp`);
                yield sock.sendMessage(m.key.remoteJid, {
                    sticker: { url: `./media/${filename}.webp` },
                });
            }
        }
        if (((_d = m.message.videoMessage) === null || _d === void 0 ? void 0 : _d.caption) === "!stickv2") {
            if (messageType === "videoMessage") {
                const filename = (0, nanoid_1.nanoid)();
                const stream = yield (0, baileys_1.downloadContentFromMessage)(m.message.videoMessage, "video");
                let buffer = Buffer.from([]);
                try {
                    for (var stream_2 = __asyncValues(stream), stream_2_1; stream_2_1 = yield stream_2.next(), !stream_2_1.done;) {
                        const chunk = stream_2_1.value;
                        buffer = Buffer.concat([buffer, chunk]);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (stream_2_1 && !stream_2_1.done && (_b = stream_2.return)) yield _b.call(stream_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                yield (0, promises_1.writeFile)(`./media/${filename}.mp4`, buffer);
                yield (0, convertMp4ToWebp_1.convertMp4ToWebp)(`./media/${filename}.mp4`, `./media/${filename}-1.webp`);
                yield (0, sharp_1.default)(`./media/${filename}-1.webp`, { animated: true })
                    .resize({ width: 512, height: 512 })
                    .webp({ quality: 5 })
                    .toFile(`./media/${filename}.webp`);
                if ((0, fs_1.statSync)(`./media/${filename}.webp`).size > 1000000) {
                    yield sock.sendMessage(m.key.remoteJid, {
                        sticker: { url: `./media/${filename}.webp` },
                    });
                }
                else {
                    yield sock.sendMessage(m.key.remoteJid, { text: "Sticker muy pesado" });
                }
            }
        }
    });
}
exports.messageHandler = messageHandler;
