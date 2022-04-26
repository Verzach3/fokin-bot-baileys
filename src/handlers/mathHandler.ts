import Mexp from "math-expression-evaluator";

export function mathHandler(splitMessage: string[], sendTextMessage: (contactId: string, message: string) => void, chatId: string | null | undefined) {
  if (splitMessage[0] === "!num") {
    try {
      let text = "Opps!";
      if (splitMessage[1] === "toD") {
        text = parseInt(splitMessage[2], parseInt(splitMessage[3])).toString();
      } else if (splitMessage[1] === "fromD") {
        text = parseInt(splitMessage[2]).toString(parseInt(splitMessage[3]));
      }
      sendTextMessage(chatId!, text);
    } catch (error) { }
  }

  if (splitMessage[0] === "!solve") {
    sendTextMessage(chatId!,
      Mexp.eval(splitMessage.slice(1).join(""))
    );
  }
}
