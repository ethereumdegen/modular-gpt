

import axios from 'axios'

const submodulesConfig = require("../config/submodules.json")


export function getApiUrlForSubmodule(submodule:string){
    const baseURI = "http://localhost"
    return `${baseURI}:${submodulesConfig[submodule].port}/`
}


export async function sendJsonRpcRequest(apiUri:string, body:{method:string,params:any,jsonrpc?:string}){
    
    /*const body:any = {

        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [ '0x9c726d89806588066152951842895A77fEEE173d', 1 ]
      

    }*/

    let response = await axios({
        method:'post',
        url:apiUri,
        data:body
        
    })//.post(apiUri,  body  )
 

    return response 

}

 