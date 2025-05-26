import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
export const requestClient = new RequestNetwork({
  nodeConnectionConfig: { 
    baseURL: "https://gnosis.gateway.request.network",
  },
});