import { Telegraf,session } from "telegraf";
import config from 'config'
import { message}  from 'telegraf/filters'
import { ogg } from "./ogg.js";
import { openai } from "./openAi.js";
import {code} from "telegraf/format"

const INNITIAL_SESSION ={
    messages:[]
}
const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));
bot.use(session())
bot.command('new',async(ctx)=>{
    ctx.session =INNITIAL_SESSION
    console.log(ctx.session.messages);
    await ctx.reply('Wait for new voice request')
})
bot.command('start',async(ctx)=>{
    ctx.session =INNITIAL_SESSION
    await ctx.reply('Wait for new voice request')
})
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
        await ctx.reply(code(`Text message accepted please wait for response 🕓✅`))
        await ctx.replyWithHTML(`<b> 🫵🏼 Your request:\n\n${ctx.message.text}</b>`)
        ctx.session.messages.push({role:openai.roles.USER,content:ctx.message.text})
        const response = await openai.chat(ctx.session.messages)
        ctx.session.messages.push({role:openai.roles.ASSISTANT,content:response.content})
        await ctx.reply(response.content)
        console.log(ctx.session.messages);
    }catch(e){
        console.error(e);
    }
})
bot.launch()

process.once('SIGINT',()=>bot.use('SIGINT'))
process.once('SIGTERM',()=> bot.stop('SIGTERM'))