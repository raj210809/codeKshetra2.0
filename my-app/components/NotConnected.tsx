import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletIcon } from "lucide-react"

export default function NotConnected() {
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Connect Your Wallet</CardTitle>
        <CardDescription>Please connect your wallet to continue</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <WalletIcon className="w-16 h-16 text-primary" />
        <p className="text-center text-muted-foreground">
          To access all features, you need to connect your wallet. Check out the dashboard sidebar
        </p>
     
      </CardContent>
    </Card>
  )
}