import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGallery } from "@/lib/content/gallery";

export async function RealisationsSection() {
  const gallery = await getGallery();
  const categories = ["Mariage", "Quotidien"] as const;

  return (
    <section id="products" className="relative w-full bg-stone-50 py-12 sm:py-16 lg:py-20">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-3xl font-bold text-[#c39c51] sm:text-4xl lg:text-5xl">Réalisations</h2>

          <Tabs defaultValue="Mariage" className="w-full items-stretch">
            <TabsList className="mb-8 h-auto w-fit gap-1 rounded-xl bg-stone-200 p-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="h-auto rounded-lg px-6 py-2 text-sm font-semibold data-active:bg-white data-active:text-[#c39c51]"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat} value={cat}>
                <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
                  {gallery
                    .filter((item) => item.category === cat)
                    .map((item) => (
                      <div key={item.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#e6d5a3]">
                        <div className="relative w-full">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={600}
                            height={800}
                            className="h-auto w-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#c39c51] via-[#e6d5a3] to-[#c39c51]" />
    </section>
  );
}
