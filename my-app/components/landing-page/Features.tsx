import { BentoDemo } from "./BentoFeatures"



/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cr4mNGqTsLp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Features() {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 grid lg:grid-cols-1 gap-12">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Easy process for invoice streaming</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              The all in one tool for managing your web3 activity, receive invoices, stream money and manage everything in one place
            </p>
          </div>
          <BentoDemo />
        </div>
      </section>
    )
  }