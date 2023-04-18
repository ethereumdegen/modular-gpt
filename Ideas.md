

## ideas 

1. 
A global npm package. When you give it a command, it will search the local repo folder for a package.json.  Then it will ask chatGPT to select the correct script to run based on your query.  It will double check with you to make sure you want to run that and if so, it will run it . 

Can also list the scripts in your project.  



reply only with the name of the script that I should run for my query.  scripts: ["server","test","test:migrate","lint","format","services","db"] .  query: "migrate the test db"



2. make the main prompt service exposed and listening on a JSONRPC port , then build a global npm package that can be used to send it queries 