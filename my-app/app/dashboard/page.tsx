"use client";

import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import React, { useEffect } from 'react';
import Spinner from '@/components/helpers/Spinner';
import InvoiceDashboard from '@/components/dashboard/InvoiceDashboard';

const Page = () => {
  const { data: session, status, error } = useSession();

  useEffect(() => {
    console.log('Session Data:', session);
  }, [session]);

  // Handle possible errors
  if (error) {
    console.error("Session error:", error);
    return <div className="text-red-500 text-center mt-8">Error: {error.message || "Something went wrong"}</div>;
  }

  return (
    <>
      <Navbar />
      {status === 'loading' ? (
        <div className='flex justify-center mt-8'>
          <Spinner className='mt-2' />
        </div>
      ) : status === 'authenticated' && session?.user?.name ? (
        <InvoiceDashboard />
      ) : (
        <NotConnected />
      )}
    </>
  );
};

export default Page;
