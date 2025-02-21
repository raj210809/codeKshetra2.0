"use client";

import React, { useEffect, useState } from 'react'
import { SenderDetails } from './SenderDetails'
import { PaymentDetails } from './PaymentDetails';
import { StreamTypeSelector } from './StreamTypeSelector';

import { FormDataType  } from '@/types/types';
import { ConfirmationComponent } from './ConfirmationComponent';

const CreateInvoiceComponent = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<FormDataType>({        
      senderDetails: {
          name: "",
          email: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          country: ""
      },
      paymentDetails: {
          receiverAddress: "",
          chain: "",
          currency: "USDC",
          dueDate: new Date(),
          invoiceItems: [],
      },
      streamType: "linear"
    });

    const updateFormData = <T extends keyof FormDataType>(
      section: T,
      newData: Partial<FormDataType[T]> | FormDataType[T]
    ) => {
      setFormData((prevData) => ({
        ...prevData,
        [section]: 
          (typeof prevData[section] === 'object' && prevData[section] !== null)
            ? { ...(prevData[section] as object), ...(newData as object) }
            : newData,
      }));
    };


    useEffect(() => {
     console.log(formData)
    }, [formData])
      
    return (
        <div className='flex flex-col items-center mt-8'>
           
            
            {step === 0 && (
                <SenderDetails 
                    setStep={setStep} 
                    senderDetails={formData.senderDetails}
                    updateSenderDetails={(newDetails) => updateFormData('senderDetails', newDetails)}
                />
            )}
            {step === 1 && (
                <PaymentDetails 
                    setStep={setStep}
                    paymentDetails={formData.paymentDetails}
                    updatePaymentDetails={(newDetails) => updateFormData('paymentDetails', newDetails)}
                />
            )}
            {step === 2 && (
                <StreamTypeSelector 
                    setStep={setStep}
                    streamType={formData.streamType}
                    updateStreamType={(newStreamType) => setFormData(prev => ({ ...prev, streamType: newStreamType }))}
                />
            )}
            {step === 3 && (
                <ConfirmationComponent 
                    formData={formData}
                    setStep={setStep}
                />
            )}
        </div>
    )
}

export default CreateInvoiceComponent