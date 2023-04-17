
 
 import { GptMessage } from "../interfaces/types"
import {getOpenAIApiKey} from "../lib/api-key-helper"
 import {tryRequest, getOpenAiKeyHeader } from "../lib/request-lib"

 //import {  CreateImageRequestSizeEnum } from 'openai'

  const API_KEY = getOpenAIApiKey()



export async function getModels(){


    return await tryRequest({
        method: 'GET',
        url: 'https://api.openai.com/v1/models',
        headers: {
          Authorization: getOpenAiKeyHeader(API_KEY)
        }
    })
}


/*
 
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "text-davinci-003",
    "prompt": "Say this is a test",
    "max_tokens": 7,
    "temperature": 0
  }'*/


 
export async function createChatCompletion(
    {
        model,
        prompt,
        systemPrompt,
        chatHistory,
        max_tokens,
        temperature
      }:{
        model:string
        prompt:string
        systemPrompt?:string
        chatHistory?:GptMessage[]
        max_tokens?:number
        temperature?:number
      }

){

//  "messages": [{"role": "user", "content": "Hello!"}]
    let messages:any =  [  ]

    if(chatHistory){
      chatHistory.forEach((hMsg)=>{
        messages.push({
          role:hMsg.role,
          content:hMsg.content
        })
      })
    }

    messages.push(   {
        role:"user",
        content: prompt 
    })

    if(systemPrompt){
      messages.push({
        role:"system",
        content:"systemPrompt"
      })
    }



    return await tryRequest({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        data:{
          model,
          messages,
          max_tokens: max_tokens ? max_tokens : 1000,
          temperature: temperature ? temperature: 0
        },
        headers: {
          Authorization: getOpenAiKeyHeader(API_KEY)
        }
    })
    


}

export async function createCompletion(
  {
    model,
    prompt,
    max_tokens,
    temperature
  }:{
    model:string
    prompt:string
    max_tokens?:number
    temperature?:number
  }
){
  

  return await tryRequest({
    method: 'post',
    url: 'https://api.openai.com/v1/completions',
    data:{
      model,
      prompt,
      max_tokens: max_tokens ? max_tokens : 1000,
      temperature: temperature ? temperature: 0
    },
    headers: {
      Authorization: getOpenAiKeyHeader(API_KEY)
    }
})

}



export async function createImage(
  {
  //  model,
    prompt,
    n,
    size
  }:{
    //model:string
    prompt:string
    n?:number
    size?:any
  }
){
  

  return await tryRequest({
    method: 'post',
    url: 'https://api.openai.com/v1/images/generations',
    data:{
     // model,
      prompt,
      n: n? n: 1,
      size : size?size:"512x512",
    },
    headers: {
      Authorization: getOpenAiKeyHeader(API_KEY)
    }
})

}
