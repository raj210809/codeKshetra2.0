import { IRequestDataWithEvents } from "@requestnetwork/request-client.js/dist/types"

export type SupportedNetwork = "sepolia" | "mumbai"


export type generateRequestParamatersParams = {
    payeeIdentity: string,
    payerIdentity: string,
    expectedAmount: string,
    feeRecipient?: string,
    tokenAddress?: string,
    dueDate: string | Date | number,
    invoiceItems: invoiceItems,
    expectedFlowRate: string,
    chain: string

}

export type WaveInConfirmationData = {
    dueDate: string,
    reason?: string,
    payee: string,
    payer: string
    currencyAddress: string,
    expectedAmount: string | number,
    requestId: string,
    expectedFlowRate: string
}


export type WaveInData = {
    dueDate: string,
    reason?: string,
    payee: string,
    payer: string
    currencyAddress: string,
    expectedAmount: string | number,
    requestId: string,
    expectedFlowRate: string
    currentBalance: number
}


export type SenderDetailsType = {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    evmAddress?: string;
  };
  
 export type PaymentDetailsType = {
    receiverAddress: string;
    chain: string;
    currency: string;
    dueDate: Date | undefined | number;
    invoiceItems: Array<{ name: string; quantity: number; price: number }>;
  };
  
 export type StreamType = 'linear' | 'monthly';
  
 export type FormDataType = {
    senderDetails: SenderDetailsType;
    paymentDetails: PaymentDetailsType;
    streamType: StreamType;
  };


  export type invoiceItems = Array<{ name: string; quantity: number; price: number }>;


export interface SenderDetails {
    evmAddress: string;
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    profile_image?: string;
  }

  export type StreamData = {
    amounts: {
      deposited: bigint;
      refunded: bigint;
      withdrawn: bigint;
    };
    asset: string;
    cliffTime: number;
    endTime: number;
    isCancelable: boolean;
    isDepleted: boolean;
    isStream: boolean;
    isTransferable: boolean;
    recipient: string;
    sender: string;
    startTime: number;
    wasCanceled: boolean;
  }
  
  export type Gig = {
    gig_id: string;
    creator_address: string;  // This is now the evmAddress
    title: string;
    description: string | null;
    price: number;
    chain_id: number;
    delivery_time: string;
    created_at: string;
  }

  export interface GigData {
    gig: Gig;
    creatorProfile: {
      name: string;
      profile_image: string;
      evmAddress: string;
    };
  }
  