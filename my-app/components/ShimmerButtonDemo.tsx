import ShimmerButton from "@/components/magicui/shimmer-button";

export function ShimmerButtonDemo() {
  return (
    <div className="z-10 flex min-h-[0rem] items-center justify-center">
      <ShimmerButton className="shadow-md" borderRadius="10px">
        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
          Get Started
        </span>
      </ShimmerButton>
    </div>
  );
}
