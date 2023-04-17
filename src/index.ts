import OpenAiController from "./openapi-controller"
import {getOpenAIApiKey} from "../lib/api-key-helper"
 
import chalk from 'chalk'
import prompts from 'prompts'

require('dotenv').config();


const API_KEY = getOpenAIApiKey()
 
let aiController = new OpenAiController(API_KEY)

const AI_MODEL = process.env.AI_MODEL;
let aiModel:string = AI_MODEL || 'gpt-3.5-turbo'
  
   

const running = true ; 
 

let pastChatHistory:any[] = [] 
const MAX_HISTORY_LEN = 10 

const modeColor = chalk.green
const botColor = chalk.cyan

//@ts-ignore
//import readline from 'readline-promise';
import { handleUserInput } from "./commands";
import { GptMessage, GptResponseChoice, TurboGptResponse } from "../interfaces/types";
import { isAssertionSuccess } from "../lib/assertion-helper";
 
 

function outputFormatted(rawResponse:any){

    if(rawResponse.text){
        console.log(`> ${rawResponse.text}`)
        return
    }

    console.log(JSON.stringify((rawResponse)))
}


function setupTerminal(){

    //readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY)
        process.stdin.setRawMode(true);

    /*process.stdin.on('keypress', (chunk, key) => {
        if(key && key.name == 'tab'){
            incrementMode(  )
        }
    
    });*/


}

/*
function incrementMode( ){

    switch(mode){

        case 'text': mode = 'image';break;
        case 'image': mode = 'text';break;
        default: mode = 'text';break;
    }

    console.log(  modeColor(`mode switched to: ${mode}  \n`))


}*/


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

async function init(){

   // const spinner = ora('Loading unicorns')

    console.log( 'Welcome to Power-GPT. \n \n' )


    setupTerminal()
  


    while (running){

        const question = chalk.blue(`What would you like to ask? ` )
       // let modeLabel = modeColor(` mode: ${mode}  \n `)

      //  const userInput = await lineReader.questionAsync(question.concat(" ")) 
 
        const userInput = await prompts({
            type: 'text',
            name: 'input',
            message: question
          });

        const resCallback = (response:any) => { 
 

            if(response.success){
                const output = response.data 
                outputFormatted( output )
            }else{
                console.log(chalk.red(response.error))
            }

        }

        //change this so text is added to the terminal differently... maybe by being PUSHED out 
        //let response = await handleUserInput(userInput, resCallback)
        
        let promptInput = userInput.input

      
  
        let response = await aiController.queryChat({
            prompt: promptInput,
            model: aiModel,
            chatHistory: getChatHistory()
        }) 
        
        if(isAssertionSuccess(response)){
            
            pushToChatHistory({
                role:"user", 
                content:promptInput,
            })
  
            
            handleGptResponse( response.data )
        }else{
            console.error(response.error)
        }
 

        
    }
    

}



init()