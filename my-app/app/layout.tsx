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
  metadataBase: new URL('http://localhost:3000/'),
  title: "SecureInvoice.xyz",
  description: "SecureInvoice.xyz - Streaming invoices onchain.",
  openGraph: {
    title: "SecureInvoice app",
    description: "SecureInvoice.xyz - Streaming invoices onchain.",
    url: "http://localhost:3000/",
    siteName: "SecureInvoice.xyz",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureInvoice app",
    description: "SecureInvoice app - Real time payments and invoicing",
    site: "",
    creator: "",
    images: [""],
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
