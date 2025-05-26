import React from 'react'
import { cn } from '@/lib/utils'

type SpinnerProps = {
    className: string;
}



const Spinner = ({className}: SpinnerProps) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("animate-spin", className)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
  )
}

export default Spinner

