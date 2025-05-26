"use client";

import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import React, { useEffect } from 'react';
import Spinner from '@/components/helpers/Spinner';
import { useParams } from 'next/navigation';
import ReportDao from '@/components/reportDao/ReportDao';

const Page = () => {
  const { data: session, status } = useSession();
  const params = useParams();

  useEffect(() => {
    console.log('session');
  }, [session]);

 

  return (
    <>
      <Navbar />
      {status === 'loading' ? (
        <div className='flex justify-center mt-8'>
          <Spinner className='mt-2' />
        </div>
      ) : status === 'authenticated' && session?.user?.name ? (
        <div className=''>
          <ReportDao/>
        </div>
      ) : (
        <NotConnected />
      )}
    </>
  );
};

export default Page;