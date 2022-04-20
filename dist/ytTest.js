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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ytTest = void 0;
const fs_1 = require("fs");
function ytTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const Innertube = require("youtubei.js");
        const youtube = yield new Innertube();
        const search = (title) => __awaiter(this, void 0, void 0, function* () {
            return yield youtube.search(title, {
                client: "YOUTUBE",
                period: "any",
                order: "relevance",
                duration: "any"
            });
        });
        const results = yield search("miracle caravan");
        console.log(results);
        console.log(yield youtube.getDetails(results.videos[0].id));
        const stream = youtube.download(results.videos[0].id, {
            format: "mp4",
            quality: "360p",
            type: "videoandaudio"
        });
        stream.pipe((0, fs_1.createWriteStream)(`./${results.videos[0].title}.mp4`));
        stream.on('start', () => {
            console.info('[DOWNLOADER]', 'Starting download now!');
        });
        stream.on('info', (info) => {
            console.info('[DOWNLOADER]', `Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`);
        });
        stream.on('progress', (info) => {
            process.stdout.cursorTo(0);
            process.stdout.write(`[DOWNLOADER] Downloaded ${info.percentage}% (${info.downloaded_size}MB) of ${info.size}MB`);
        });
        stream.on('end', () => {
            process.stdout.cursorTo(0);
            console.info('[DOWNLOADER]', 'Done!');
        });
        stream.on('error', (err) => console.error('[ERROR]', err));
    });
}
exports.ytTest = ytTest;
ytTest();
