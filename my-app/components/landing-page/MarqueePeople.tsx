import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import JoinWaitlistForm from "./JoinWaitlistForm";

const reviews = [
  {
    name: "BlackIcon.eth",
    username: "@TBlackicon",
    body: "Exciting ! Can't wait to use Stream Bill 🔥",
    img: "/blackicon.png",
  },
  {
    name: "Will Fan",
    username: "@hellowillfan",
    body: "Great job by @_AlexAstro, who's leveraging blockchain to ensure that teachers receive timely and secure payments.",
    img: "/will_fan.jpg",
  },
  {
    name: "Harry Zhang",
    username: "@harryzhangs",
    body: "love the shout-out, @_AlexAstro keep building my guy 🔥",
    img: "/harry_zhang.jpg",
  },
  {
    name: "Open Campus",
    username: "@opencampus_xyz",
    body: "@_AlexAstro is enabling a reliable method for teachers to manage their finances and receive payments promptly.",
    img: "/opencampus.png",
  },
  {
    name: "Request Network",
    username: "@RequestNetwork",
    body: "There's no better feeling for an infrastructure project than having past hackathon alums use your infra repeatedly in other hackathons 🛠️",
    img: "/request.png",
  },
  {
    name: "Pieter Claesen",
    username: "@Pclaesen",
    body: "Looking forward to the launch",
    img: "/pieter.jpg",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col  items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl ">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      <div className="mt-8 absolute z-10 bottom-[3%] flex justify-center">
      <JoinWaitlistForm />
      </div>
    </div>
  );
}
