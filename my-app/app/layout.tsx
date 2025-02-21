import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { SessionWrapper } from "@/components/SessionWrapper";
import { Analytics } from '@vercel/analytics/react';
import Navbar from "@/components/Navbar";
import OCConnectWrapper from "@/components/OCConnectWrapper";
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from "@/components/ThemeProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://app.streambill.xyz'),
  title: "StreamBill.xyz",
  description: "StreamBill.xyz - Streaming invoices onchain.",
  openGraph: {
    title: "Streambill app",
    description: "StreamBill.xyz - Streaming invoices onchain.",
    url: "https://app.streambill.xyz",
    siteName: "StreamBill.xyz",
    images: [
      {
        url: "https://app.streambill.xyz/streambill-banner.png",
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Streambill app",
    description: "Streambill app - Real time payments and invoicing",
    site: "@_alexastro",
    creator: "@_alexastro",
    images: ["https://app.streambill.xyz/streambill-banner.png"],
  },
}


const opts = {
  redirectUri: 'http://localhost:3000/edu-redirect', // Adjust this URL
  referralCode: 'PARTNER6'

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
       
      <GoogleAnalytics gaId="G-NCZ42WG6BR" />
        <Providers>
          <SessionWrapper>
          <OCConnectWrapper opts={opts} >

            <div className="block lg:flex">
              <Navbar /> {/* Add the Navbar here */}
              <main className="lg:flex-1 lg:ml-64 p-4 mt-4 ">
         
                {children}
            
                <Analytics />
              </main>
            </div>
            </OCConnectWrapper>
            <Toaster />
          </SessionWrapper>
        </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
