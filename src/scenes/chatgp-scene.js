import { Scenes } from "telegraf";
import { endChatKeyboard } from "../keyboards/end-chat.js";
import { globalCallbackQueryHandler } from "../keyboard-handlers/globalInlineHandler.js";
import {code} from "telegraf/format"
import { openai } from "../openAi.js";

const INNITIAL_SESSION ={
  messages:[]
}
// Create the wizard scene
export const wizardScene = new Scenes.WizardScene('chatgpt-chat',
(ctx) => {
  ctx.session ??= INNITIAL_SESSION
  console.log(ctx.session);
    //  Welcoming to chat
    ctx.reply('You are welcome to Chatgpt in Telegram, you can start conversation\nYou can send both Voice and Text messages while chatting')
    return ctx.wizard.next();
  },
  async (ctx) => {

    if(ctx.callbackQuery){
      globalCallbackQueryHandler(ctx);
      return;
    }
     // Delete the inline keyboard if it has been sent before
     if (ctx.scene.state.chatAndMessageKeyboard && ctx.chat.id===ctx.scene.state.chatAndMessageKeyboard.chat_id) {
      ctx.telegram.editMessageReplyMarkup(ctx.scene.state.chatAndMessageKeyboard.chat_id,ctx.scene.state.chatAndMessageKeyboard.message_id,null);
    }
    
    const message = ctx.message;
    
    let response;
    if (message.text) {
    // Chat with text
        //Accepted message
        await ctx.reply(code(`Text message accepted please wait for response 🕓✅`))
        await ctx.replyWithHTML(`<b> 🫵🏼 Your request:\n\n${ctx.message.text}</b>`)

        //Saving the message to the chat
        ctx.session.messages.push({role:openai.roles.USER,content:ctx.message.text})
        // Getting response from openai
         response = await openai.chat(ctx.session.messages)

        //Saving response to the chat
        ctx.session.messages.push({role:openai.roles.ASSISTANT,content:response.content})
    } else if (message.voice) {
      // Handle voice messages
      const voice = message.voice;
      ctx.reply(`You sent a voice message with duration: ${voice.duration} seconds.`);
      // Additional logic for voice messages
      // ...
    }
    const chatAndMessageKeyboard = await endChatKeyboard(response.content,ctx) ;
    ctx.scene.state.chatAndMessageKeyboard =chatAndMessageKeyboard;
  }
);
