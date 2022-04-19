import sharp from "sharp";


export async function convertWebpm(){
  await sharp('./kirbi.gif', {animated: true}).webp({quality: 100}).toFile('./kirbi.webp');
}

convertWebpm()