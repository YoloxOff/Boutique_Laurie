import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/sections/section-heading";
import { getSalonPage, getTeam } from "@/lib/content/team";

export const metadata: Metadata = {
  title: "Le Salon",
  description:
    "Découvrez l'histoire et les valeurs de Laurie, coiffeuse à domicile diplômée du Brevet Professionnel, à Toulouse et sa périphérie.",
};

export default async function LeSalonPage() {
  const [salon, team] = await Promise.all([getSalonPage(), getTeam()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Diplômée du Brevet Professionnel depuis 2012" title="L'histoire de Laurie" />
      <p className="mx-auto mt-6 max-w-2xl text-center text-muted-foreground">{salon.history}</p>

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {salon.photos.map((photo, i) => (
          <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image src={photo} alt="Le salon Laurie Coiffure" fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="Ce qui nous anime" title="Nos valeurs" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {salon.values.map((value) => (
            <div key={value} className="rounded-xl border border-border p-6 text-center">
              <p className="font-heading text-lg">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="Coiffeuse à domicile" title="Laurie" />
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full">
                <Image src={member.photo} alt={member.name} fill sizes="160px" className="object-cover" />
              </div>
              <h3 className="mt-4 font-heading text-lg">{member.name}</h3>
              <p className="text-sm text-accent-foreground/70">{member.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {salon.virtualTourUrl && (
        <div className="mt-20 text-center">
          <a href={salon.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium underline underline-offset-4">
            Visite virtuelle du salon
          </a>
        </div>
      )}
    </div>
  );
}
