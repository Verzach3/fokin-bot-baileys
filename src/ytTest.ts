import { createWriteStream } from "fs";
import { YouTubeSearch } from "youtubei.js";

export async function ytTest() {
  const Innertube = require("youtubei.js");
  const youtube = await new Innertube();
  const search = async (title: string) => await youtube.search(title, {
    client: "YOUTUBE",
    period: "any",
    order: "relevance",
    duration: "any"
  });
  const results: YouTubeSearch = await search("miracle caravan") as YouTubeSearch
  console.log(results)
  console.log(await youtube.getDetails(results.videos[0].id))
  const stream = youtube.download(results.videos[0].id, {
    format: "mp4",
    quality: "360p",
    type: "videoandaudio"
  })

    
  stream.pipe(createWriteStream(`./${results.videos[0].title}.mp4`));
 
  stream.on('start', () => {
    console.info('[DOWNLOADER]', 'Starting download now!');
  });
  
  stream.on('info', (info: { video_details: { title: any; metadata: { channel_name: any; }; }; }) => {
    // { video_details: {..}, selected_format: {..}, formats: {..} }
    console.info('[DOWNLOADER]', `Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`);
  });
  
  stream.on('progress', (info: { percentage: any; downloaded_size: any; size: any; }) => {
    process.stdout.cursorTo(0);
    process.stdout.write(`[DOWNLOADER] Downloaded ${info.percentage}% (${info.downloaded_size}MB) of ${info.size}MB`);
  });
  
  stream.on('end', () => {
    process.stdout.cursorTo(0);
    console.info('[DOWNLOADER]', 'Done!');
  });
  
  stream.on('error', (err: any) => console.error('[ERROR]', err)); 
}

ytTest();