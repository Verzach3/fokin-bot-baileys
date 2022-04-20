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
exports.dlVideo = void 0;
const fs_1 = require("fs");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const IT = require("youtubei.js");
function dlVideo(link) {
    return __awaiter(this, void 0, void 0, function* () {
        const youtube = yield new IT();
        if (ytdl_core_1.default.validateURL(link)) {
            const videoId = ytdl_core_1.default.getURLVideoID(link);
            const video = yield youtube.getDetails(videoId);
            if (video.length_seconds > 600) {
                console.log("Video demasiado largo");
                return null;
            }
            else {
                const stream = youtube.download(videoId, {
                    format: "mp4",
                    quality: "360p",
                    type: "videoandaudio",
                });
                stream.pipe((0, fs_1.createWriteStream)(`./${video.title}.mp4`));
                stream.on("start", () => {
                    console.info("[DOWNLOADER]", "Starting download now!");
                });
                stream.on("info", (info) => {
                    console.info("[DOWNLOADER]", `Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`);
                });
                stream.on("progress", (info) => {
                    process.stdout.cursorTo(0);
                    process.stdout.write(`[DOWNLOADER] Downloaded ${info.percentage}% (${info.downloaded_size}MB) of ${info.size}MB`);
                });
                stream.on("end", () => {
                    process.stdout.cursorTo(0);
                    console.info("[DOWNLOADER]", "Done!");
                });
                stream.on("error", (err) => console.error("[ERROR]", err));
            }
            console.log(video);
        }
    });
}
exports.dlVideo = dlVideo;
dlVideo("https://www.youtube.com/watch?v=XRP9k9nlAfE");
