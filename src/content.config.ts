import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every content type here matches a section in the admin page (.pages.yml).
// Optional fields stay optional so a half-filled entry never breaks the site.

// Fields left empty in the admin page may be saved as null, so treat null as "empty".
const text = z.string().nullish().transform((v) => v ?? '');
const flag = z.boolean().nullish().transform((v) => v ?? false);
const order = z.number().nullish().transform((v) => v ?? 100);
const date = z.coerce.date();

const exhibitions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/exhibitions' }),
  schema: z.object({
    title: z.string(),
    artists: text,
    start: date,
    end: date,
    image: text,
    imageCredit: text,
    summary: text,
    opening: text,
    featureColour: text,
    draft: flag,
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    type: text,
    date: date,
    startTime: text,
    endTime: text,
    price: text,
    summary: text,
    image: text,
    bookingLink: text,
    draft: flag,
  }),
});

const workshops = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/workshops' }),
  schema: z.object({
    title: z.string(),
    medium: text,
    audience: text,
    tutor: text,
    date: date,
    startTime: text,
    endTime: text,
    cost: text,
    places: text,
    summary: text,
    image: text,
    draft: flag,
  }),
});

const artists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artists' }),
  schema: z.object({
    name: z.string(),
    medium: text,
    town: text,
    portrait: text,
    works: z
      .array(
        z.object({
          title: z.string(),
          year: text,
          medium: text,
          size: text,
          price: text,
          image: text,
          status: z.string().nullish().transform((v) => v || 'Available'),
        }),
      )
      .nullish()
      .transform((v) => v ?? []),
    order,
    draft: flag,
  }),
});

const publicArt = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/public-art' }),
  schema: z.object({
    title: z.string(),
    artist: text,
    year: text,
    location: text,
    image: text,
    order,
    draft: flag,
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    intro: text,
    image: text,
  }),
});

export const collections = { exhibitions, events, workshops, artists, publicArt, pages };
