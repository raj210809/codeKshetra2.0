'use client';

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Users, Code, Video, Share2, Clock, DollarSign, Award, Twitter, Send, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import FreelancerCard from './FreelancerCard';
import { freelancers } from '@/helper/freelancerData';

export default function DiscoverParent() {
    const [email, setEmail] = useState('')
    const [xHandle, setXHandle] = useState('')
    const [tgHandle, setTgHandle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const [role, setRole] = useState('')
    const [otherRole, setOtherRole] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await fetch('/api/discover-apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    xHandle,
                    tgHandle,
                    role,
                    otherRole,
                    description,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to submit application')
            }

            toast({
                title: "Application submitted!",
                description: "We'll review your profile and reach out to you soon.",
            })
        } catch (error) {
            console.error('Error submitting application:', error)
            toast({
                title: "Error",
                description: "Failed to submit application. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
            setEmail('')
            setXHandle('')
            setTgHandle('')
            setRole('')
            setOtherRole('')
            setDescription('')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <div className="max-w-4xl w-full space-y-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2">Discover is coming soon</h1>
                    <p className="text-xl sm:text-2xl mb-8">Showcasing talent</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-card rounded-xl p-4 sm:p-6 md:p-8 shadow-xl border border-border"
                >
                    <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-sm sm:text-md font-light mb-4 text-muted-foreground">Are you a</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <div className="flex flex-col items-center">
                                <Users className="w-12 h-12 mb-2" />
                                <span>Discord Mod</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Code className="w-12 h-12 mb-2" />
                                <span>Developer</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Video className="w-12 h-12 mb-2" />
                                <span>Content Creator</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Share2 className="w-12 h-12 mb-2" />
                                <span>Social Media Manager</span>
                            </div>
                        </div>
                        <h3 className="text-sm sm:text-md  font-light text-muted-foreground mt-4 mb-4">Do you want to</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center text-center">
                                <Users className="w-12 h-12 mb-2 text-primary" />
                                <span className="text-md font-medium">Expand your network</span>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center text-center">
                                <DollarSign className="w-12 h-12 mb-2 text-primary" />
                                <span className="text-md font-medium">Get paid in real time for your services</span>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center text-center">
                                <Award className="w-12 h-12 mb-2 text-primary" />
                                <span className="text-md font-medium">Be featured on our app for free</span>
                            </div>
                        </div>
                        <div className="bg-muted py-4 rounded-lg">
                        <p className="text-base sm:text-lg font-bold text-primary">Apply below</p>
                            <p className="text-base sm:text-lg font-semibold text-muted-foreground">We have limited spots!</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                        <div className="flex flex-col gap-4">
                            <div className="w-full">
                                <Select onValueChange={setRole} value={role}>
                                    <SelectTrigger className="bg-input border-input text-foreground">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="discord_mod">Discord Mod</SelectItem>
                                        <SelectItem value="developer">Developer</SelectItem>
                                        <SelectItem value="content_creator">Content Creator</SelectItem>
                                        <SelectItem value="social_media_manager">Social Media Manager</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {role === 'other' && (
                                <div className="w-full">
                                    <Input
                                        type="text"
                                        placeholder="Specify your role"
                                        value={otherRole}
                                        onChange={(e) => setOtherRole(e.target.value)}
                                        required
                                        className="bg-input border-input text-foreground placeholder-muted-foreground"
                                    />
                                </div>
                            )}
                            <div className="w-full">
                                <div className="relative">
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-input border-input text-foreground placeholder-muted-foreground pl-8"
                                    />
                                    <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="X handle"
                                        value={xHandle}
                                        onChange={(e) => setXHandle(e.target.value)}
                                        required
                                        className="bg-input border-input text-foreground placeholder-muted-foreground pl-8"
                                    />
                                    <Twitter className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Telegram handle"
                                        value={tgHandle}
                                        onChange={(e) => setTgHandle(e.target.value)}
                                        required
                                        className="bg-input border-input text-foreground placeholder-muted-foreground pl-8"
                                    />
                                    <Send className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="w-full">
                                <textarea
                                    placeholder="A few words about yourself ( example : Video creator with 2 years of experience in creating short-form and long-form videos for my clients )"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="w-full h-24 p-2 bg-input border-input text-foreground placeholder-muted-foreground rounded-md resize-none"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'I want in'
                            )}
                        </Button>
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6">Already in!</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 text-left">
                        {freelancers.map((freelancer, index) => (
                            <FreelancerCard
                                key={index}
                                name={freelancer.name}
                                profileImage={freelancer.profileImage}
                                role={freelancer.role}
                                description={freelancer.description}
                                link={freelancer.link}
                            />
                        ))}
                    </div>
                </motion.div>

            
            </div>
        </div>
    )
}
