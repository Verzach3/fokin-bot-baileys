"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomIntegerInRange = void 0;
function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.generateRandomIntegerInRange = generateRandomIntegerInRange;
