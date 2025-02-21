import Navbar from "@/components/Navbar";
import Hero from "@/components/landing-page/Hero";
import Features from "@/components/landing-page/Features";
import PeopleShowcase from "@/components/landing-page/PeopleShowcase";
import FollowTheJourney from "@/components/landing-page/FollowTheJourney";

export default function Home() {
  return (
    <main className="">
    <Navbar />
    <Hero />
    {/* <Benefits /> */}
    <Features />
     <PeopleShowcase />
 
     <FollowTheJourney />
    </main>
  );
}
