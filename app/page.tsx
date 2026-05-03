import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import LiveDemo from "@/components/LiveDemo";
import IsIsNot from "@/components/IsIsNot";
import SystemsShowcase from "@/components/SystemsShowcase";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Audience from "@/components/Audience";
import EngineeringCredibility from "@/components/EngineeringCredibility";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="bg-[#0c0c0e] min-h-screen">
      <Nav />
      <main>
        <Hero />
        <LiveDemo />
        <IsIsNot />
        <SystemsShowcase />
        <ArchitectureDiagram />
        <HowItWorks />
        <Pricing />
        <Audience />
        <EngineeringCredibility />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
