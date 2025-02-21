'use client'

import { ReactNode } from 'react';
//@ts-ignore
import { OCConnect, OCConnectProps } from '@opencampus/ocid-connect-js';



export default function OCConnectWrapper({ children, opts, sandboxMode }: any) {
  return (
    <OCConnect opts={opts} sandboxMode={sandboxMode}>
      {children} 
    </OCConnect>
  );
}