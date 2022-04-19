"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@adiwajshing/baileys"));
const fs_1 = require("fs");
const messageHandler_1 = require("./messageHandler");
const { state, saveState } = (0, baileys_1.useSingleFileAuthState)("./auth.json");
(0, fs_1.mkdir)("./media", (err) => console.log(err));
function connectToWhatsapp() {
    return __awaiter(this, void 0, void 0, function* () {
        const sock = (0, baileys_1.default)({
            auth: state,
            printQRInTerminal: true,
        });
        sock.ev.on("connection.update", (update) => {
            var _a, _b;
            const { connection, lastDisconnect } = update;
            if (connection === "close") {
                const shouldReconnect = ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !==
                    baileys_1.DisconnectReason.loggedOut;
                console.log("connection closed due to error ", ", reconnecting ", shouldReconnect);
                if (shouldReconnect) {
                    connectToWhatsapp();
                }
            }
            else if (connection === "open") {
                console.log("Connection opened");
            }
        });
        sock.ev.on("creds.update", saveState);
        sock.ev.on("messages.upsert", ({ messages }) => {
            console.log("New Messages", messages);
            (0, messageHandler_1.messageHandler)(messages, sock);
        });
        sock.ev.on("chats.update", (chats) => {
            console.log("New Chats", chats);
        });
    });
}
connectToWhatsapp();
