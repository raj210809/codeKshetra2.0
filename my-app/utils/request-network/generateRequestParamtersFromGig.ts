import { generateRequestParamatersParams, invoiceItems } from "@/types/types";
import { Types, Utils } from "@requestnetwork/request-client.js";
import {IRequestCreateParameters} from "@/types/interfaces";
import { SupportedNetwork } from "@/types/types";
// import { TOKEN_ADDRESS_SEPOLIA, USDCX_CONTRACT_ADDRESS_SEPOLIA } from "./constants";
import { ICreateRequestParameters } from "@requestnetwork/request-client.js/dist/types";
// const payeeIdentity = '0x7eB023BFbAeE228de6DC5B92D0BeEB1eDb1Fd567';
// const payerIdentity = '0x519145B771a6e450461af89980e5C17Ff6Fd8A92';
// const paymentRecipient = payeeIdentity;
// const feeRecipient = '0x0000000000000000000000000000000000000000';




export function generateRequestParamatersFromGig({
   payeeIdentity,
  payerIdentity,
  expectedAmount,
  tokenAddress,
  dueDate,
  invoiceItems,
  expectedFlowRate,
  chain
}: generateRequestParamatersParams): ICreateRequestParameters  {
  const requestCreateParameters: ICreateRequestParameters = {
    requestInfo: {
      
      // The currency in which the request is denominated
      currency: {
        type: Types.RequestLogic.CURRENCY.ERC777,
        //ADD TOKEN ADDERSS
        value: tokenAddress || "token address",
        // ! MAKE IT REPLACEBLE
        network: 'sepolia',
      },
      

      
      // The expected amount as a string, in parsed units, respecting `decimals`
      // Consider using `parseUnits()` from ethers or viem
      expectedAmount: expectedAmount,
      
      // The payee identity. Not necessarily the same as the payment recipient.
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
      
      // The payer identity. If omitted, any identity can pay the request.
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
      },
      
      // The request creation timestamp.
      timestamp: Utils.getCurrentTimestampInSecond(),
    },
    
    // The paymentNetwork is the method of payment and related details.
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ERC777_STREAM,
      parameters: {

        //INT / SECOND
        expectedFlowRate: expectedFlowRate,
        expectedStartDate: Date.now().toString(),
        paymentAddress: payeeIdentity,
        refundAddress: '0x0000000000000000000000000000000000000003',
        salt: 'ea3bc7caf64110ca',
        
      },
    },
    
    // The contentData can contain anything.
    // Consider using rnf_invoice format from @requestnetwork/data-format
    contentData: {
      invoiceItems: invoiceItems,
      dueDate: dueDate as number * 1000,
      RequestType: 'InvoiceStreaming',
      builderId: "streambill",
      createdWith: window.location.hostname,
      chain: chain
    },
    
    
    // The identity that signs the request, either payee or payer identity.
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payerIdentity,
    },

    
    


}

return requestCreateParameters;


}
