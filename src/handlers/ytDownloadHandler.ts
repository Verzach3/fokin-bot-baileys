import { dlAudio, dlVideo } from "../yt";

export function ytDownloadHandler(
  splitMessage: string | string[],
  sender: string | null | undefined,
  sock: any,
  splitExtendedMessage: string | string[],
  sendTextMessage: (contactId: string, message: string) => void,
  sendVideoMessage: (
    contactId: string,
    videoPath: string,
    caption?: string | undefined
  ) => void,
  sendAudioMessage: (contactId: string, audioPath: string) => void,
) {
  if (splitMessage![0] === "!dlvideo") {
    dlVideo(splitMessage![1], sender || "", sendTextMessage, sendVideoMessage, sendAudioMessage);
  } else if (splitExtendedMessage![0] === "!dlvideo") {
    dlVideo(
      splitExtendedMessage![1],
      sender || "",
      sendTextMessage,
      sendVideoMessage,
      sendAudioMessage
    );
  }

  if (splitMessage![0] === "!dlaudio") {
    dlAudio(splitMessage![1], sender || "", sendTextMessage, sendVideoMessage, sendAudioMessage);
  } else if (splitExtendedMessage![0] === "!dlaudio") {
    dlAudio(
      splitExtendedMessage![1],
      sender || "",
      sendTextMessage,
      sendVideoMessage,
      sendAudioMessage
    );
  }
}
