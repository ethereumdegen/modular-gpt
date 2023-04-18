

import axios from 'axios'

const submodulesConfig = require("../config/submodules.json")


export interface JSONRPCPacket {
    method:string,params:any,id:string,jsonrpc:string
}

export function getPortForSubmodule(submodule:string){
    return submodulesConfig[submodule].port
}

export function getApiUrlForSubmodule(submodule:string){
    const baseURI = "http://localhost"
    return `${baseURI}:${getPortForSubmodule(submodule)}/`
}


export async function sendSubmoduleRequest( 
    {moduleName,method,params,id}:{
    moduleName:string,method:string,params:any,id?:string
} ) {


    const apiUri = getApiUrlForSubmodule(moduleName)

    const body:JSONRPCPacket = { 
        jsonrpc: '2.0',
        id: id || '0',
        method: method, 
        params: params  
    }

    let response = await sendJsonRpcRequest(apiUri,body)

    return response
}

export async function sendJsonRpcRequest(apiUri:string, body:JSONRPCPacket){
    
    /*const body:any = {

        jsonrpc: '2.0',
        method: 'eth_getCode',
        id: '0',
        params: [ '0x9c726d89806588066152951842895A77fEEE173d', 1 ]
      

    }*/

    let response = await axios({
        method:'post',
        url:apiUri,
        data:body
        
    }) 
 

    return response 

}

 