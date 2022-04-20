"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumber = void 0;
function randomNumber(message, sock) {
    var _a, _b;
    const splitMessage = (_b = (_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) === null || _b === void 0 ? void 0 : _b.split(" ");
    console.log(splitMessage);
    if (splitMessage[0] === "!random") {
        const min = parseInt(splitMessage[1]);
        const max = parseInt(splitMessage[2]);
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        sock.sendMessage(message.key.remoteJid, {
            text: `${randomNumber}`,
        });
    }
}
exports.randomNumber = randomNumber;
