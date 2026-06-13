import Navbar from "@/components/Navbar";
import OurTeamCarousel from "@/components/CommunityStoryCarousel";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Our Team",
  description: "Meet the AWS Student Builders Group REC team members.",
};

export default function OurTeamPage() {
  return (
    <>
      <Navbar />
      <main style={{ width: "100%", overflowX: "hidden", paddingTop: "80px" }}>
        <OurTeamCarousel />
      </main>
      <Footer />
    </>
  );
}
