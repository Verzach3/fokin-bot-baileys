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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMp4ToWebp = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
function convertMp4ToWebp(path, expath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(path)
                .on("error", reject)
                .on("end", () => resolve(true))
                .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`]).toFormat('webp').save(expath);
        });
    });
}
exports.convertMp4ToWebp = convertMp4ToWebp;
