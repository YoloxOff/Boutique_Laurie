import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content/posts";
import { formatDate } from "@/lib/format";
import { jsonLdArticle } from "@/lib/seo/jsonld";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdArticle({
              title: post.title,
              description: post.excerpt,
              slug: post.slug,
              imageUrl: post.coverImage,
              publishedAt: post.publishedAt,
            })
          ),
        }}
      />
      <p className="text-xs uppercase tracking-wide text-accent-foreground/70">{post.category}</p>
      <h1 className="mt-2 font-heading text-3xl sm:text-4xl">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{formatDate(post.publishedAt)}</p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
      </div>

      <div className="prose prose-neutral mt-10 max-w-none">
        <p>{post.content}</p>
      </div>
    </article>
  );
}
