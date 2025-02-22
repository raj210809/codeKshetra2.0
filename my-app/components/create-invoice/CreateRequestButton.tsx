import React, { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { generateRequestParameters } from "@/utils/request-network/generateRequestParamaters";
import { generateRequestParamatersParams, invoiceItems } from "@/types/types";
import { useWalletClient } from "wagmi";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { RequestNetwork } from "@requestnetwork/request-client.js";

import Spinner from "../helpers/Spinner";
import ShimmerButton from "../magicui/shimmer-button";
import RequestConfirmed from "./RequestConfirmed";
import { CreateRequestButtonProps, UserDetailsFromSupabase } from "@/types/interfaces";
import PingAnimation from "../helpers/PingAnimation";
import { format } from "date-fns";



const CreateRequestButton: React.FC<CreateRequestButtonProps> = ({
  payeeEVMAddress,
  payerEVMAddress,
  payeeDetails,
  payerDetails,
  expectedAmount,
  dueDate,
  invoiceItems,
  chain


}) => {
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [requestId, setRequestId] = useState("");

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [linkState, setLinkState] = useState("");

  const handleClick = async () => {
    console.log({
      payeeEVMAddress,
      payerEVMAddress,
      payeeDetails,
      payerDetails,
      expectedAmount,
      dueDate,
      invoiceItems,
      chain
    });
  
    if (!payerEVMAddress || !expectedAmount || !dueDate || invoiceItems.length < 1) {
      alert("Please fill in all the fields");
      return;
    }
  
    setIsConfirmed(false);
    setLoading(true);
    setDialogOpen(true);
    setDialogMessage("Creating Request...");
  
    try {
      const web3SignatureProvider = new Web3SignatureProvider(walletClient);
  
      // ✅ Ensure Base Sepolia Gateway URL is correct
      const baseSepoliaGateway = "https://sepolia.gateway.request.network";
  
      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: baseSepoliaGateway,
        },
        signatureProvider: web3SignatureProvider,
      });
      console.log("Request Client:", requestClient);
  
      // ✅ Confirm the correct token address on Base Sepolia
      const tokenAddressBaseSepolia = "0xc75ab970D9492f6b04d66153CcCED146e60A7D5B"; // Double-check this
  
      const requestParameters = generateRequestParameters({
        payeeIdentity: payeeEVMAddress,
        payerIdentity: payerEVMAddress,
        expectedAmount,
        dueDate,
        invoiceItems,
        tokenAddress: tokenAddressBaseSepolia,
        expectedFlowRate: "15",
        chain // Ensure this is set to Base Sepolia
      });
  
      console.log("Request Parameters:", requestParameters);
  
      // ✅ Creating Request
      const request = await requestClient.createRequest(requestParameters);
      console.log("Request:", request);
      setDialogMessage("Request Created Successfully! Confirming Request...");
  
      // ✅ Waiting for Confirmation
      const confirmedRequestData = await request.waitForConfirmation();
      console.log("Confirmed Request Data:", confirmedRequestData);
      setDialogMessage("Request Confirmed");
  
      console.log("Request ID:", confirmedRequestData.requestId);
  
      setLinkState(`https://wavein.vercel.app/confirm-wavein/${confirmedRequestData.requestId}`);
  
      // ✅ Save invoice in Supabase
      const response = await fetch('/api/post-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: confirmedRequestData.requestId,
          payeeDetails,
          payerDetails,
          payerEVMAddress,
          payeeEVMAddress,
          expectedAmount,
          dueDate,
          chain,
          gateway: 'sepolia'
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }
  
      setRequestId(confirmedRequestData.requestId);
      setDialogMessage("Request Created Successfully");
      setIsConfirmed(true);
      setLoading(false);
  
    } catch (error: any) {
      console.error("Request Error:", error);
  
      alert(`Error: ${error.message || "Unknown Error"} | Check gateway & token settings`);
      setDialogMessage(`Error: ${error.message || error}`);
      setLoading(false);
  
    } finally {
      // Keep final cleanup here if needed
    }
  };
  

  useEffect(() => {
    console.log(chain);
  }, [chain]);


  useEffect(() => {
    console.log('Chain prop in CreateRequestButton:', chain);
  }, [chain]);


  return (
    <>
      <ShimmerButton onClick={handleClick} className=" mt-0" disabled={loading} >
        {loading ? "Loading..." : "Create Invoice"}
      </ShimmerButton>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isConfirmed ? "Request created" : "Creating Request"}    <PingAnimation color="blue" size="small" /></DialogTitle>
        
          </DialogHeader>
          {loading === true && isConfirmed === false &&
            <div className="flex flex-col items-center justify-center p-4">

              <Spinner className="mb-4" />
              <p>{dialogMessage}</p>
            </div>
          }

          {isConfirmed === true &&
            <div className="flex flex-col items-center justify-center p-4">

              <RequestConfirmed requestId={requestId} />

            </div>


          }

        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRequestButton;