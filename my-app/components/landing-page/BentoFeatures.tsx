"use client";

import { FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, HandCoinsIcon, HandshakeIcon, Share2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import {AnimatedBeamMultipleOutputDemo} from "@/components/example/animated-beam-multiple-outputs";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import Marquee from "@/components/magicui/marquee";
import { WithRealTimeInvoicing } from "../animated-lists/WithRealTimeInvoicing";
import DisplayCountUp from "./DisplayCountUp";

const files = [
  {
    name: "Invoice-March.pdf",
    body: "Amount: $8500, Reason: Website Development, Payer: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e, Payee: 0x123F681646d4A755815f9CB19e1aCc8565A0c2AC",
  },
  {
    name: "Invoice-July.pdf",
    body: "Amount: $3200, Reason: Graphic Design Work, Payer: 0x8474DdbE98F5aA3179B3B3F5942D724aFcdec9f6, Payee: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  {
    name: "Invoice-November.pdf",
    body: "Amount: $12000, Reason: Software Consultancy, Payer: 0x6B175474E89094C44Da98b954EedeAC495271d0F, Payee: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  {
    name: "Invoice-February.pdf",
    body: "Amount: $5800, Reason: Content Writing, Payer: 0xdAC17F958D2ee523a2206206994597C13D831ec7, Payee: 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  },
  {
    name: "Invoice-September.pdf",
    body: "Amount: $18500, Reason: Marketing Campaign, Payer: 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, Payee: 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  },
];

const features = [
  {
    Icon: FileTextIcon,
    name: "Manage invoices",
    description: "We securely store your invoices using Request Network",
    href: "#",
    cta: "Coming soon",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description: "Get notified when something happens.",
    href: "#",
    cta: "Coming soon",
    className: "hidden md:flex col-span-3 lg:col-span-2",
    background: (
      <WithRealTimeInvoicing 
  className="
    absolute 
    right-[-0%] top-0
    sm:right-2 sm:top-3
    md:right-2 md:top-4
    lg:right-2 lg:top-4
    h-[250px] w-[350px]
    sm:h-[250px] sm:w-[400px]
    md:h-[300px] md:w-[500px]
    lg:h-[300px] lg:w-[600px]
    border-none transition-all duration-300 ease-out
    [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]
    group-hover:scale-105
  "
/>
    ),
  },
  {
    Icon: Share2Icon,
    name: "Built on reliable protocols",
    description: "We use Request Network to handle invoicing and Sablier to integrate real time payments.",
    href: "#",
    cta: "Coming soon",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute right-[-5%] top-[-5%] md:right-2 md:top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: HandCoinsIcon,
    name: "Get paid, for real",
    description: "Every second your balance increases",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Coming soon",
    background: (
      <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)]">
        <DisplayCountUp 
          maxValue={5000}
          tokenSymbol="USDC"
          duration={6000000}
        />
      </div>
    ),
  },
];

export function BentoDemo() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
