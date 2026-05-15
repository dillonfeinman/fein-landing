import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import LiveDemo from "@/components/LiveDemo";
import RevenueEngine from "@/components/RevenueEngine";
import EngagementProcess from "@/components/EngagementProcess";
import ROICalculator from "@/components/ROICalculator";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import ServiceRequest from "@/components/ServiceRequest";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="bg-[#0c0c0e] min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Capabilities />
        <LiveDemo />
        <RevenueEngine />
        <EngagementProcess />
        <ROICalculator />
        <Pricing />
        <About />
        <FAQ />
        <ServiceRequest />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
