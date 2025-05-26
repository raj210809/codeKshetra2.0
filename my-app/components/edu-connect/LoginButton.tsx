'use client'

import React from 'react';
//@ts-ignore
import { useOCAuth } from '@opencampus/ocid-connect-js';
import { Button } from "@/components/ui/button"
import Image from 'next/image';

export default function LoginButton() {
  const { ocAuth } = useOCAuth();

  const handleLogin = async () => {
    try {
      await ocAuth.signInWithRedirect({ state: 'opencampus' });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Button 
      onClick={handleLogin}
      className="w-full bg-black hover:bg-gray-800 text-white font-medium
                 rounded-lg py-2 px-4 flex items-center justify-center
                 transition-colors duration-300 ease-in-out"
    >
      <Image src={'/opencampus.png'} width={28} height={28} alt="OCID logo" className='rounded-full mr-2' />
      Connect <span className='font-bold ml-1'>{" "} OCID</span>
    </Button>
  );
}