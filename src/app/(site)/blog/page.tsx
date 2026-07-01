import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/sections/section-heading";
import { getAllPosts } from "@/lib/content/posts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog & Conseils",
  description: "Nos conseils d'experts pour l'entretien de vos cheveux, les tendances coiffure et le choix de vos produits.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Conseils d'experts" title="Le blog Laurie Coiffure" />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="mt-3 text-xs uppercase tracking-wide text-accent-foreground/70">{post.category}</p>
            <h2 className="mt-1 font-heading text-lg">{post.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
            <p className="mt-2 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
