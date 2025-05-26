import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink } from "lucide-react"

interface FreelancerProps {
  name: string
  profileImage: string
  role: string
  description: string
  link: string
}

export default function FreelancerCard({ name, profileImage, role, description, link }: FreelancerProps) {
  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profileImage} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow mt-2">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button variant="outline" className="w-full" asChild>
          <a href={link} target="_blank" rel="noopener noreferrer">
            View Profile
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
