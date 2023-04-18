import GenericController from "../../lib/generic-controller";

//import { ControllerMethod } from "degen-route-loader"
import { webSearch } from "./lib/ddg_search";

export async function search(params: any): Promise<any> {
  // webSearch: ControllerMethod = async (params: any) => {

  console.log({ params });
  let searchQuery = params[0];

  console.log({ searchQuery });

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
