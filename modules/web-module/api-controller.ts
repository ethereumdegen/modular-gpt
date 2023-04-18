 
 
import { webSearch } from "./lib/ddg_search";




export async function fetchGptQueryWithSearch(params:any): Promise<any> {

   
    let query = (params[0] || "").toString()
    let web_results = await getWebResults(query)
 

    const queryBase = `Web search results:\n\n${JSON.stringify(web_results)}\n\nInstructions: Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.\nQuery: ${query}`;
  
    return queryBase
}


export async function getWebResults(searchQuery: any): Promise<any> {
  // webSearch: ControllerMethod = async (params: any) => {
  

  let numResults = 6;
  let searchResponse = await webSearch(
    {
      query: searchQuery,
      timerange: "all",
      region: "all",
    },
    numResults
  );

  console.log({ searchResponse });

  return searchResponse;
}
