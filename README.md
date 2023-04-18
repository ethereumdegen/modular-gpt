## Modular GPT

OpenAI in your command prompt with modules. 

Modules are plugins (microservices) which the primary prompting process uses to extend its capabilities.  This is done using JSONRPC communications to various local ports. 
 

### Pre-requisites 

1. NodeJS 16 (can install with nvm)


### Getting Started 

1. Create a file named .env and add the token 
```
OPENAI_API_KEY={your api key} 
```

 (https://platform.openai.com/account/api-keys)

2. yarn && yarn start 




![image](https://user-images.githubusercontent.com/6249263/227419638-1f703d4f-163a-4c14-86f7-97e148313c67.png)


### Using modules 

#### Web Module 
To use the web module, in the .env file, add

```
MODULE=web
```

Then, run this command in a separate terminal to boot the webmodule microservice 

```
yarn webmodule start 
```


Now, in your main terminal, use 'yarn start' as normal to boot the primary prompting process.  Your queries will first be routed to the webmodule microservice and processed with a custom system prompt including web search results before being sent to be processed by GPT. 


 ![image](https://user-images.githubusercontent.com/6249263/232649540-10ee4417-c116-44d5-99cd-25c8a016f990.png)
 
 This is a result of a GPT3.5 output with embedded links!! Even though it would not embed those links by default, the webmodule microservice is helping inject the additional context. 


