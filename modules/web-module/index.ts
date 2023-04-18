import WebServer from "../../lib/web-server";
import submoduleConfigFile from "../../config/submodules.json";

import localConfig from "./config.json";
import { Route } from "degen-route-loader";
import { search } from "./api-controller";
 

 /*
{
      "jsonrpc": "2.0",
        "method": "search",
        "id":"0",
        "params": [ "dogs" ] 

}
 */



const moduleName = localConfig.name;
const routes: Array<Route> = localConfig.routes;

//@ts-ignore
let serverConfig = submoduleConfigFile[moduleName];

async function start() {
  const { JSONRPCServer } = require("json-rpc-2.0");

  const jrpcserver = new JSONRPCServer();

  /*for (let route of routes) {
      jrpcserver.addMethod(route.uri, apiController[route.method]);
  }*/
  jrpcserver.addMethod("search", search);
 

  let rpcserver = new WebServer(serverConfig, jrpcserver);
  await rpcserver.start();
}

start();
