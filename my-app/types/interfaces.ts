import { Types, Utils } from "@requestnetwork/request-client.js";
import { invoiceItems, SupportedNetwork } from "./types";


export interface IRequestCreateParameters {

  requestInfo: {
  currency: {
    type: Types.RequestLogic.CURRENCY.ERC777;
    value: string;
    network: SupportedNetwork;
  };

  // The expected amount as a string, in parsed units, respecting `decimals`
  // Consider using `parseUnits()` from ethers or viem
  expectedAmount: string;

  // The payee identity. Not necessarily the same as the payment recipient.
  payee: {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS;
    value: string;
  };

  // The payer identity. If omitted, any identity can pay the request.
  payer: {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS;
    value: string;
  };

  timestamp: number;

  // The paymentNetwork is the method of payment and related details.
  paymentNetwork: {
    id: Types.Extension.PAYMENT_NETWORK_ID.ERC777_STREAM;
    parameters: {
      paymentNetworkName: SupportedNetwork;
      paymentAddress: string;
      feeAddress: string;
      feeAmount: string;
    };
  }
   
    // The contentData can contain anything.
    // Consider using rnf_invoice format from @requestnetwork/data-format
    contentData: {
      reason: string;
      dueDate: string;
    };

    // The identity that signs the request, either payee or payer identity.
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS;
      value: string;
    };
  }
  
}



export interface MockDataInvoice {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  evmAddress: string;
}

export interface SenderDetails {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentDetails {
  chain: string;
  currency: string;
  receiverAddress: string;
  dueDate: Date | null;
  invoiceItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface FormData {
  senderDetails: SenderDetails;
  paymentDetails: PaymentDetails;
  streamType: string;
}

export interface InvoiceContentProps {
  mockDataInvoice: MockDataInvoice;
  formData: FormData;
  totalAmount: number;
}


export interface  UserDetailsFromSupabase {
  evmAddress: string;
  name: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}


export interface  UserDetailsFromSupabaseOnInvoice {
  name: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}



export interface CreateRequestButtonProps {
  payeeEVMAddress: string;
  payerEVMAddress: string;
  payeeDetails: UserDetailsFromSupabase;
  payerDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  expectedAmount: string;
  dueDate: number;
  invoiceItems: invoiceItems;
  chain: string;

}


export interface IPaymentDetails {
  payeeAddress: string,
  payerAddress: string,
  chain: string | number,
  currency: string,
  streamType: string,
  dueDate: Date | string | number,
  totalAmount: string | number,
  invoiceItems: invoiceItems,
  stream_id?: number,
  chain_id: number
  

}

export interface IInvoiceData {
   partiesDetails : {
      seller : UserDetailsFromSupabaseOnInvoice,
      client : UserDetailsFromSupabaseOnInvoice
   },
   paymentDetails: IPaymentDetails
}

export interface IInvoiceDataGig {
  partiesDetails : {
     seller : UserDetailsFromSupabaseOnInvoice,
     client : UserDetailsFromSupabaseOnInvoice
  },
  paymentDetails: IPaymentDetails,
  gig_id: string
}