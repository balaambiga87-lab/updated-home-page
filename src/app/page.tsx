import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Domains from "@/components/Domains";
import About from "@/components/About";
import OurTeamShowcase from "@/components/CommunityStoryCarousel";
import Gallery from "@/components/Gallery";
import ReviewsMarquee from "@/components/ReviewsMarquee";

import Events from "@/components/Events";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ overflowX: "hidden", width: "100%" }}>
        <Hero />
        <Domains />
        <About />
        <OurTeamShowcase />
        <Gallery />
        <ReviewsMarquee />
        
        <Events />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
