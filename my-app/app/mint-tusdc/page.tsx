'use client';


import { GetTUSDC } from '@/components/mint-tusdc/GetTUSDC'
import Navbar from '@/components/Navbar'
import NotConnected from '@/components/NotConnected';
import React from 'react'
import { useAccount } from 'wagmi'

const Page = () => {


   const {address, isConnected} = useAccount();


  return (
    <div>
     <Navbar />
     <div className='flex justify-center mt-12'>
      {isConnected ? <GetTUSDC /> : <NotConnected />}
     </div>
    </div>
  )
}

export default Page