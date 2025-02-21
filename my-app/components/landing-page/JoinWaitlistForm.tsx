'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { ConfettiFireworks } from './ConfettiFireWorksButton'
import { useToast } from '../ui/use-toast'
import Spinner from '../helpers/Spinner'


const JoinWaitlistForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {
    if (email.length < 1) {
      toast({
        title: "Error",
        description: "Please add your email",
        variant: "destructive",
      })
      return;
    }

    setIsLoading(true)
    setIsModalOpen(true)

    try {
      const response = await fetch('/api/joinWaitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to join waitlist')
      }

      setIsSuccess(true)
      toast({
        title: "Signed up",
        description: `${email} has been added to the waitlist`,
      })
    } catch (error) {
      console.error('Error joining waitlist:', error)
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      })
      setIsModalOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShareOnX = () => {
    const tweetText = encodeURIComponent("✅ I'm on the waitlist for StreamBill ! Check it out at https://streambill.xyz  @_alexastro")
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
    window.open(tweetUrl, '_blank')
  }

  return (
    <>
      <div className="flex w-full max-w-md space-x-4">
        <Input
          className="flex-grow"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ConfettiFireworks buttonText="Join Waitlist" onClick={handleSubmit} isSuccess={isSuccess} />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isLoading ? 'Joining Waitlist...' : "You're In!"}</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner className='w-8 h-8' />
            </div>
          ) : (
            <>
              <p className='text-4xl text-center font-bold my-4'>Thank you for your early support!</p>
              <Button onClick={handleShareOnX}>Post on X</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default JoinWaitlistForm