import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import LiveDemo from "@/components/LiveDemo";
import ROICalculator from "@/components/ROICalculator";
import Pricing from "@/components/Pricing";
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
        <LiveDemo />
        <ROICalculator />
        <Pricing />
        <FAQ />
        <ServiceRequest />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
