"use client";
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { useToast } from '../ui/use-toast';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileForm } from './ProfileForm';

interface SenderDetails {
  evmAddress: string
  name: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export function CreateProfile() {
  const { address } = useAccount();
  const [senderDetails, setSenderDetails] = useState<SenderDetails>({
    evmAddress: address as string,
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })
  const [editMode, setEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast();
  const [isFetching, setIsFetching] = useState(false)
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setSenderDetails(prev => ({ ...prev, [id]: value }))
  }

  const fetchUserDetails = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/get-user-details?address=${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      console.log("data frontend", data)
      if (data) {
        setSenderDetails(prevDetails => ({
          ...prevDetails,
          ...data,
          evmAddress: address as string,
        }));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user details. You may enter them manually.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  }

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    
    if (redirect) {
      setEditMode(true);
    } else if (address) {
      fetchUserDetails();
    }
  }, [address, searchParams]);

  const validateAndProceed = async () => {
    if (!senderDetails.name || !senderDetails.email) {
      toast({
        title: "Error",
        description: "Name and Email are required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(senderDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to save user details');
      }

      const result = await response.json();
      console.log('Details saved successfully:', result);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(`/${redirect}`);
      }

    } catch (error) {
      console.error('Error saving details:', error);
      toast({
        title: "Error",
        description: "Failed to save details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[90%] lg:w-[85%] xl:w-[65%] mt-20 md:mt-0">
      <Card className="">
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>Information used to complete invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            senderDetails={senderDetails}
            handleInputChange={handleInputChange}
            editMode={editMode}
            isFetching={isFetching}
            toggleEditMode={toggleEditMode}
            validateAndProceed={validateAndProceed}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}