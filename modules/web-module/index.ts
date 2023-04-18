import WebServer from "../../lib/web-server";
import submoduleConfigFile from "../../config/submodules.json";

import localConfig from "./config.json";
 
import { fetchGptQueryWithSearch } from "./api-controller";
 
const { JSONRPCServer } = require("json-rpc-2.0");
 /*
{
      "jsonrpc": "2.0",
        "method": "search",
        "id":"0",
        "params": [ "dogs" ] 

}
 */



const moduleName = localConfig.name;
 

//@ts-ignore
let serverConfig = submoduleConfigFile[moduleName];

async function start() {


  const jrpcserver = new JSONRPCServer();

  /*for (let route of routes) {
      jrpcserver.addMethod(route.uri, apiController[route.method]);
  }*/
  jrpcserver.addMethod("search", fetchGptQueryWithSearch);
 

  let rpcserver = new WebServer(serverConfig, jrpcserver);
  await rpcserver.start();
}

start();
