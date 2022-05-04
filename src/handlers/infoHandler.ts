export function infoHandler(splitMessage: string[], sendTextMessage: (contactId: string, message: string) => void, chatId: string | null | undefined) {
  if (splitMessage[0] === "!info") {
    if (splitMessage[1] === "" || splitMessage[1] === undefined) {
      sendTextMessage(
        chatId!,
        "Te falta el nombre de el comando: ejemplo !info !stick"
      );
    } else if (splitMessage[1] === "!stick") {
      sendTextMessage(
        chatId!,
        "Genera stickers con la imagen o video que envies"
      );
    }
    if (splitMessage[1] === "!dlvideo") {
      sendTextMessage(chatId!, "Descarga videos de youtube con el link");
    }
    if (splitMessage[1] === "!dlaudio") {
      sendTextMessage(chatId!, "Descarga audios de youtube con el link");
    }
    if (splitMessage[1] === "!ban") {
      sendTextMessage(
        chatId!,
        "Banea el usuario mencionandolo con el @ o respondiendo un mensaje de este con !ban"
      );
    }
    if (splitMessage[1] === "!report") {
      sendTextMessage(chatId!, "Reporta un problema a el desarrollador");
    }

    if (splitMessage[1] === "!num") {
      sendTextMessage(chatId!, "Convertidor de numeros a diferentes base ej: decimal a binario");
    }

    if (splitMessage[1] === "!solve") {
      sendTextMessage(chatId!, "Resuelve operacione matematicas simples");
    }

  }
}
