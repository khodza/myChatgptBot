import { Telegraf,session,Scenes } from "telegraf";
import { message}  from 'telegraf/filters'
import { ogg } from "./ogg.js";
import  dotenv from 'dotenv';
dotenv.config();
import { openai } from "./openAi.js";
import {code} from "telegraf/format"
import{startKeyboard} from "./keyboards/start-keyboard.js"
import {handleCommand} from "./keyboard-handlers/keyboard-handler.js"
import { wizardScene } from "./scenes/chatgp-scene.js";
import { globalCallbackQueryHandler } from "./keyboard-handlers/globalInlineHandler.js";
const INNITIAL_SESSION ={
    messages:[]
}
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
bot.use(session())

bot.action('callback_query',globalCallbackQueryHandler)
// Register the wizard scene with the bot
const stage = new Scenes.Stage([wizardScene]);
bot.use(stage.middleware());

// bot.command('new',async(ctx)=>{
//     ctx.session =INNITIAL_SESSION
//     console.log(ctx.session.messages);
//     await ctx.reply('Wait for new voice request')
// })

// Start the bot
bot.start((ctx) => {
    ctx.session =INNITIAL_SESSION
    startKeyboard(ctx)
});

bot.on('text', handleCommand);


bot.on(message('voice'),async(ctx)=>{
    ctx.session ??= INNITIAL_SESSION
    try{
        await ctx.reply(code(`Voice message accepted please wait for response 🕓✅`))
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
        const userId =String(ctx.message.from.id);
        const oggPath = await ogg.create(link.href,userId);
        const mp3Path =await ogg.toMp3(oggPath,userId);
        const text = await openai.transportation(mp3Path)
        await ctx.replyWithHTML(`<b> 🫵🏼 Your request:\n\n${text}</b>`)
        ctx.session.messages.push({role:openai.roles.USER,content:text})
        const response = await openai.chat(ctx.session.messages)
        ctx.session.messages.push({role:openai.roles.ASSISTANT,content:response.content})
        ctx.reply(response.content)
        console.log(ctx.session.messages);

    }catch(e){
        console.error(e);
    }
})

bot.on(message('text'),async(ctx)=>{
    ctx.session ??= INNITIAL_SESSION
    try{

        // // image create
        const res = await openai.CreateImage(ctx.message.text);
        if(!res){
          return ctx.reply(`There was an error while generating image , make sure that you provided valid prompt 🤨🔞`)
      }
        // console.log(res);
        ctx.reply(res)
        // chat
        // await ctx.reply(code(`Text message accepted please wait for response 🕓✅`))
        // await ctx.replyWithHTML(`<b> 🫵🏼 Your request:\n\n${ctx.message.text}</b>`)
        // ctx.session.messages.push({role:openai.roles.USER,content:ctx.message.text})
        // const response = await openai.chat(ctx.session.messages)
        // await ctx.reply(response.content)
        // ctx.session.messages.push({role:openai.roles.ASSISTANT,content:response.content})
    }catch(e){
        // console.error(e);
        ctx.reply(e)
    }
})
bot.launch()

process.once('SIGINT',()=>bot.use('SIGINT'))
process.once('SIGTERM',()=> bot.stop('SIGTERM'))