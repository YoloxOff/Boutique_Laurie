import { getGallery } from "@/lib/content/gallery";
import { RealisationsTabsClient } from "./realisations-tabs-client";

export async function RealisationsSection() {
  const gallery = await getGallery();

  return (
    <section id="products" className="relative w-full scroll-mt-20 bg-stone-50 py-12 sm:py-16 lg:py-20">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-3xl font-bold text-[#c39c51] sm:text-4xl lg:text-5xl">Réalisations</h2>
          <RealisationsTabsClient gallery={gallery} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#c39c51] via-[#e6d5a3] to-[#c39c51]" />
    </section>
  );
}
