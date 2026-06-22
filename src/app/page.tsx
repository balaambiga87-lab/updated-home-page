import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OurTeamShowcase from "@/components/CommunityStoryCarousel";
import Gallery from "@/components/Gallery";
import ReviewsMarquee from "@/components/ReviewsMarquee";
import ScrollTransitionSection from "@/components/ScrollTransitionSection";
import ServicesMarquee from "@/components/ServicesMarquee";

import AnimatedCloudBackground from "@/components/home/AnimatedCloudBackground";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ width: "100%", position: "relative" }}>
        <AnimatedCloudBackground />
        <Hero />
        <ScrollTransitionSection />
        <div style={{ height: "45px", background: "#0b0f19" }} />
        <ServicesMarquee />
        <div style={{ height: "45px", background: "#0b0f19" }} />
        <Gallery />
        <ReviewsMarquee />
        <OurTeamShowcase />
      </main>
      <Footer />
    </>
  );
}
