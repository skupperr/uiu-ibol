import Image from "next/image";
import HeroSection from "@/components/hero-section";
import AboutUs from "@/components/about-us";
import Research from "@/components/research";
import Publications from "@/components/publications";
import Collaborators from "@/components/people";
import RecentPosts from "@/components/recent-post";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";


export default function Home() {
  return (
    <main className="w-full">
      <NavBar/>
      <HeroSection/>
      <AboutUs/>
      <RecentPosts/>
      {/* <Research/>
      <Publications/>
      <Collaborators/> */}
      <Footer/>
    </main>
  );
}
