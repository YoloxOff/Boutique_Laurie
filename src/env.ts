import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Toutes les integrations externes sont optionnelles au build/dev : tant qu'une
 * cle n'est pas fournie, le code correspondant (src/lib/data, src/lib/content,
 * src/lib/stripe...) bascule automatiquement sur des donnees/mocks de demonstration.
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().optional(),

    AUTH_SECRET: z.string().min(1).optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),

    SANITY_API_TOKEN: z.string().optional(),
    SANITY_REVALIDATE_SECRET: z.string().optional(),

    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().optional(),

    BLOB_READ_WRITE_TOKEN: z.string().optional(),

    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    RECAPTCHA_SECRET_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SITE_NAME: z.string().default("Laurie Coiffure"),
    NEXT_PUBLIC_PLANITY_URL: z.string().url().default("https://www.planity.com/"),

    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
    NEXT_PUBLIC_SANITY_DATASET: z.string().default("production"),

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),

    NEXT_PUBLIC_GA4_ID: z.string().optional(),
    NEXT_PUBLIC_GTM_ID: z.string().optional(),
    NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional(),
    NEXT_PUBLIC_MESSENGER_PAGE_ID: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),

    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_PLACE_ID: z.string().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_PLANITY_URL: process.env.NEXT_PUBLIC_PLANITY_URL,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_MESSENGER_PAGE_ID: process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_PLACE_ID: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID,
  },
  emptyStringAsUndefined: true,
});
