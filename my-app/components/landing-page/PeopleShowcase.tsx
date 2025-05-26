import { BentoDemo } from "./BentoFeatures"
import { MarqueeDemo } from "./MarqueePeople"



/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cr4mNGqTsLp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function PeopleShowcase() {
    return (
      <section className="w-full py-0 md:py-0 lg:py-0">
        <div className="container px-4 md:px-6 grid lg:grid-cols-1 gap-12">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Community</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Hi 👋</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A big thank you to our early supporters.
            </p>
          </div>
          <MarqueeDemo />
        </div>
      </section>
    )
  }