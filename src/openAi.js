import { OpenAIApi,Configuration } from "openai"
import config from "config";
import {createReadStream} from 'fs'

class OpenAi {
    roles ={
        ASSISTANT:'assistant',
        USER:'user',
        SYSTEM:'system'
    }
    constructor(apiKey){
        const configuration = new Configuration({apiKey});
        this.openai =new OpenAIApi(configuration);
    }
   async chat(messages){
        try{
            const response =await this.openai.createChatCompletion({
                model:'gpt-3.5-turbo',
                messages,
            })
            return response.data.choices[0].message 
        }catch(e){console.error(e);}
    }
    async transportation(filePath){
        try{
            const response =await this.openai.createTranscription(createReadStream(filePath),'whisper-1');
            return response.data.text;
        }catch(e){
            console.error(e);
        }
    }

}
export const openai = new OpenAi(config.get('OPENAI_KEY'))