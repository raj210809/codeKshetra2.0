"use client";

import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import JoinWaitlistForm from "./JoinWaitlistForm";

export default function Hero() {
  return (
    <section className="relative w-full pt-12 md:pt-24 lg:pt-32 overflow-hidden ">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center mb-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Revolutionize Your Invoicing in Real Time
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Real time invoicing for students, teachers, freelancers and more! Using Sablier and Request Network
          </p>
           <JoinWaitlistForm />
          
          {/* Built with section */}
          <div className="flex flex-col items-center space-y-2 mt-4">
            <p className="text-sm text-muted-foreground">Built with</p>
            <div className="flex space-x-2">
              <Avatar>
                <AvatarImage src="/request.png" alt="RequestNetwork" />
                <AvatarFallback>RN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="/opencampus.png" alt="EDUCHAIN"  />
                <AvatarFallback>EDU</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="/sablier.png" alt="Sablier"  />
                <AvatarFallback>SB</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
    </section>
  );
}