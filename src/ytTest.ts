import { createWriteStream } from "fs";
import { YouTubeSearch } from "youtubei.js";
import ytdl from "ytdl-core";

export async function ytTest() {
  console.log((await ytdl.getBasicInfo("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).videoDetails.lengthSeconds);
}

ytTest();