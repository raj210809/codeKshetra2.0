import React from 'react'
import { UserDetailsFromSupabase } from '@/types/interfaces';





const SellerDataFromSupabase = ({
evmAddress,
name,
email,
address,
city,
state,
zip,
country
}: UserDetailsFromSupabase) => {


  return (
    <div>
    <h3 className="font-semibold text-lg mb-2">Seller:</h3>
    <p>{name}</p>
    <p>{email}</p>
    <p>{address}</p>
    <p>{city} {state} {zip}</p>
    <p>{country}</p>
    <p className="mt-2">EVM Address:</p>
    <p className="font-mono text-xs lg:text-base">{evmAddress}</p>
  </div>
  )
}

export default SellerDataFromSupabase