import { getAllServices } from "@/lib/content/services";
import { PricingTabsClient } from "./pricing-tabs-client";

export async function PricingSection() {
  const services = await getAllServices();

  return (
    <section id="pricing" className="relative w-full bg-stone-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-3xl font-bold text-[#c39c51] sm:text-4xl lg:text-5xl">Prestation et Tarif</h2>
        <PricingTabsClient services={services} />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#c39c51] via-[#e6d5a3] to-[#c39c51]" />
    </section>
  );
}
