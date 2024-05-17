import dotenv from "dotenv"
import { text } from "express";
dotenv.config()
import {Telegraf} from "telegraf"
const bot = new Telegraf(process.env.BOT_TOKEN);


import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_TOKEN,
  });

  const createChatCompletion = async (prompt) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You will be provided with statements, and your task is to convert them to standard English.' },
          { role: 'user', content: prompt },
        ],
      });
  
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error creating chat completion:', error);
      if(error.status === 429) {
        return "К сожалению, токены закончились, необходимо пополнить баланс OpenAI"
      }
    }
  };
  


  bot.start(async ctx => {
    await ctx.reply(`
Этот бот умеет находить ошибки в английских текстах и исправлять их
Пришли сюда текст на английском
`)
  })


  bot.on("text", async ctx => {
    console.log(ctx.message.text)
    const respons = await createChatCompletion(ctx.message.text)
    await ctx.reply(respons)
  })


  bot.launch();


  

