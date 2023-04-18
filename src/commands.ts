


 const submodulesConfig = require("../config/submodules.json")
  export const moduleNames = Object.keys(submodulesConfig) 


  export const MODULE_SELECT_QUERY_PREFIX = `what module should be used to handle this query? choose the best module name from this list and only reply with the module name: ${JSON.stringify(moduleNames)}. query:`


  export function isValidModuleName(moduleName:string){
    return moduleNames.includes(moduleName)
  }