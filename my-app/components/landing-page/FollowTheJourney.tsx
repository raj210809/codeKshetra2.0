
import TweetCard from "./MagicTweet"




/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cr4mNGqTsLp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function FollowTheJourney() {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 grid lg:grid-cols-1 gap-12">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Transparency</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Follow the Journey</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I'm posting regular updates on my X page, let's connect !
            </p>
          </div>
          <div className="flex justify-center">
          <TweetCard id="1815340545117470829"  />
          </div>
        </div>
      </section>
    )
  }