import OpenAiController from "./openapi-controller"
require('dotenv').config();


const API_KEY = process.env.OPENAI_API_KEY!

let aiController = new OpenAiController(API_KEY)



//import { Command } from "commander"; // add this line
 
  
import readline from 'readline'

const lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });


async function handleUserInput(input:string){

    let response = await aiController.query({
        prompt: input

    })

    if(response.success){

        const result:any = response.data
        

    
        const choices = result.choices 
        console.log({result})
        console.log(JSON.stringify(choices))

    }

}

async function init(){


    console.log('Welcome to Power-GPT.')


    lineReader.question(`What you like to ask? `, input => {
      
        handleUserInput(input)

        lineReader.close();
    });


    //commander interface here 

}



init()