import fs from "fs";
import http from "http";
import https from "https";
import path from "path";

import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

import { JSONRPCServer } from "json-rpc-2.0";
//const { JSONRPCServer } = require("json-rpc-2.0");

/*

    Uses port 8443 through cloudflare proxy and cf origin certificate 

*/

export interface ModuleRpcRequest {
  endpointName: string;
  moduleName: string;
  params: any;
}

export interface ModuleRpcEndpoint {
  name: string;
  route: string;
}

let PORT = process.env.PORT ? process.env.PORT : 8000;
const SSL_CERT = process.env.SSL_CERT;
const SSL_KEY = process.env.SSL_KEY;

const HTTPS_ENABLED = !!SSL_CERT && !!SSL_KEY;

require("dotenv").config();

//import sharedRoutesConfig from '../config/routes.json'
//const sharedRoutes:Array<Route> = sharedRoutesConfig;

export default class WebServer {
  server: https.Server | http.Server | undefined;

  app: any;

  appListener: any;

  constructor(public serverConfig: any, public jrpcserver: any) {
    this.app = express();
    this.app.use(bodyParser.json());

    if (serverConfig.port) {
      PORT = serverConfig.port;
    }

    let envmode = process.env.NODE_ENV;

    this.app.use(cors());
  }

  async start(): Promise<void> {
    const jserver = new JSONRPCServer();
    jserver.addMethod("echo", () => {
      console.log("echo");
      return "echo";
    });

    this.app.post("/", (req: any, res: any) => {
      const jsonRPCRequest = req.body;
      console.log("got post", jsonRPCRequest);
      // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
      // It can also receive an array of requests, in which case it may return an array of responses.
      // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
      jserver.receive(jsonRPCRequest).then((jsonRPCResponse: any) => {
        console.log("meep", jsonRPCResponse);
        if (jsonRPCResponse) {
          console.log("returning ", jsonRPCResponse);
          res.json(jsonRPCResponse);
        } else {
          console.log("no response ", jsonRPCResponse);
          // If response is absent, it was a JSON-RPC notification method.
          // Respond with no content status (204).
          res.sendStatus(204);
        }
      });
    });

    /*
  
  this.app.all("/*", (req:any, res:any) => {
      console.log('got unknown')
    res.sendStatus(404);
  })
  */

    if (HTTPS_ENABLED) {
      // Provide the private and public key to the server by reading each
      // file's content with the readFileSync() method.
      const key = fs.readFileSync(`${SSL_KEY}`);
      const cert = fs.readFileSync(`${SSL_CERT}`);

      this.appListener = https
        .createServer(
          {
            key,
            cert,
          },
          this.app
        )
        .listen(PORT, () => {
          console.log(`Backend Server listening on port ${PORT} using https`);
        });
    } else {
      this.appListener = this.app.listen(PORT);

      console.log(`Backend Server listening on port ${PORT} using http`);
    }
  }

  async stop() {
    if (this.appListener) {
      this.appListener.close();
    }
  }
}
