import { Markup } from "telegraf";

export async function endChatKeyboard(response,ctx) {
    const inlineKeyboard = Markup.inlineKeyboard([
        Markup.button.callback('End of Chat', 'end-of-chat')
      ]);
      const message =await ctx.reply(response, inlineKeyboard);
      console.log(message);
      
      const chatAndMessageKeyboard ={message_id:message.message_id,chat_id:message.chat.id};
      return chatAndMessageKeyboard;
  }