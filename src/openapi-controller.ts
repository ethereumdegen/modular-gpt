
 

 
import { AssertionResult, GptMessage, TurboGptResponse } from "../interfaces/types";
import { createChatCompletion, createImage } from "../lib/openai-lib"

export interface QueryInput {
    prompt:string,
    systemPrompt?:string,
    chatHistory?:GptMessage[],
    model?:string,  
    max_tokens?: number

}

export interface ImageInput {
    prompt:string,
    size?:any 
   

}

const DEFAULT_MODEL = "gpt-3.5-turbo" //"gpt-3.5-turbo"

export default class OpenAiController {

    

    constructor(public apikey:string ){
 

    }

    async queryChat(input:QueryInput) : Promise<AssertionResult<TurboGptResponse>>{

        try{
        const response = await createChatCompletion({
                model: input.model ? input.model : DEFAULT_MODEL , //"gpt-3.5-turbo",
                prompt: input.prompt,
                systemPrompt:input.systemPrompt,
                chatHistory: input.chatHistory,
                temperature: 0,
                max_tokens: input.max_tokens?  input.max_tokens :1000,
        });
   

            if(response && response.status == 200){ 
                return {success:true, data: response.data}
            }else{
                console.error(JSON.stringify(response))
                return {success:false, error: response?.statusText}
            }
        }catch(e:any){
            return {success:false, error: e.toString()}
        }
       
    

    }


    async generateImage(input:ImageInput){
        try{

        const response = await  createImage ({
            prompt:  input.prompt,
            n:1,
            size: input.size? input.size :  "512x512"
         } )

         if(response && response.status == 200){
            return {success:true, data: response.data}
        }else{
            return {success:false, error: response?.statusText}
        }

        }catch(e:any){
            return {success:false, error: e.toString()}
        }
       
    }
  
    


}