import OpenAiController from "./openapi-controller"
import {getOpenAIApiKey} from "../lib/api-key-helper"
const { JSONRPCServer } = require("json-rpc-2.0");

import chalk from 'chalk'
import prompts from 'prompts'

require('dotenv').config();

const WELCOME_MESSAGE = chalk.greenBright(`Welcome to Modular GPT!`)

const API_KEY = getOpenAIApiKey()
 
let aiController = new OpenAiController(API_KEY)

const AI_MODEL = process.env.AI_MODEL;
let aiModel:string = AI_MODEL || 'gpt-3.5-turbo'

const LISTEN_PORT = 6100

const MODULE_NAME = process.env.MODULE
  
const LISTEN = process.env.LISTEN || true 

const running = true ; 
 

let pastChatHistory:any[] = [] 
const MAX_HISTORY_LEN = 10 

const modeColor = chalk.green
const botColor = chalk.cyan

//@ts-ignore
//import readline from 'readline-promise';
import { handleUserInput, isValidModuleName, MODULE_SELECT_QUERY_PREFIX } from "./commands";
import { GptMessage, GptResponseChoice, TurboGptResponse } from "../interfaces/types";
import { isAssertionSuccess } from "../lib/assertion-helper";
import { getApiUrlForSubmodule, sendSubmoduleRequest } from "../lib/protocol";
import WebServer from "../lib/web-server";
 
  
function setupTerminal(){

    //readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY)
        process.stdin.setRawMode(true);

    


}
 

function pushToChatHistory(message:GptMessage){

    if(pastChatHistory.length >= MAX_HISTORY_LEN){
        pastChatHistory.shift() //pop from the start like FIFO 
    }
    pastChatHistory.push(message)

}


function getChatHistory(){
    return pastChatHistory
}


async function handleGptResponse(response:TurboGptResponse){

    if(response.choices && response.choices[0]){
        pushToChatHistory(response.choices[0].message)
    }
   
   // console.log(JSON.stringify(response))

    printGptResponse(response.choices[0])

}

function printGptResponse(choice:GptResponseChoice){
 
    console.log(`> ${botColor(choice?.message?.content)}`)
    
}

async function queryModule(moduleName:string|undefined, userInput:string ) : Promise<string>{

    if(moduleName == 'websearch'){
        
        try{
        let response = await sendSubmoduleRequest({
            moduleName,
            method:'search',
            params:[userInput], 

        })
      
        
            if(!response || !response.data){
                throw new Error('no response from submodule')
            }
      
          return response.data.result
        }catch(e){

            console.log(chalk.red(`ERROR: could not connect to submodule ${moduleName}. Is it running?`))

           // console.error(e)
            return userInput
        }

    }
    


    return userInput 

}


async function handleUserInput(userInputText:string){
       
    let moduleName = MODULE_NAME || undefined


    let moduleTypeResponse = await aiController.queryChat({
        prompt: `${MODULE_SELECT_QUERY_PREFIX} ${userInputText}`,
        model: aiModel 
    }) 

    if(isAssertionSuccess(moduleTypeResponse)){
        let moduleType = moduleTypeResponse.data?.choices[0]?.message?.content
        if(moduleType && isValidModuleName(moduleType)){
            moduleName = moduleType
            console.log('Using module: ', moduleName)
        }
    }

    let promptInput = await queryModule( moduleName, userInputText );


    let response = await aiController.queryChat({
        prompt: promptInput,
        model: aiModel,
        chatHistory: getChatHistory()
    }) 

    return response 
  


}

async function createListenServer( callback:Function ){


    const jrpcserver = new JSONRPCServer(); 


    const queryMethod = async (params:any) => {

        let response = await callback(params[0])

        if(response.success){
            return response.data?.choices[0]?.message?.content
        }else{
            return response.error
        } 
       
    }
   
    jrpcserver.addMethod("query", queryMethod);
   
  
    let rpcserver = new WebServer({port:LISTEN_PORT}, jrpcserver);
    await rpcserver.start();

}

async function init(){

 
    console.log( `${WELCOME_MESSAGE} \n \n` )


    setupTerminal()


    if(LISTEN){
        try{
            createListenServer( handleUserInput )
        }catch(e){
            console.error(e)
        }
    } 


    while (running){

        const question = chalk.blue(`What would you like to ask? ` )
        
        const userInput = await prompts({
            type: 'text',
            name: 'input',
            message: question
          });

        const userInputText = userInput.input


       let response = await handleUserInput(userInputText);
          
            
        if(isAssertionSuccess(response)){
            
            pushToChatHistory({
                role:"user", 
                content: userInputText ,
            })

            
            handleGptResponse( response.data )
        }else{
            console.error(response.error)
        }

        
    }
    

}



init()