import settings from '../data/settings.json';
import { getCollection } from 'astro:content';

export { settings };

const TZ = 'Australia/Adelaide';

/** Today's date in Adelaide as YYYY-MM-DD (the site is rebuilt daily). */
export function todayISO(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

/** A content date as YYYY-MM-DD. Dates are entered without a time, so read them in UTC. */
export function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-AU', { timeZone: 'UTC', ...opts }).format(d);

export const longDate = (d: Date) => fmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const shortDate = (d: Date) => fmt(d, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
export const dayNum = (d: Date) => fmt(d, { day: '2-digit' });
export const monthShort = (d: Date) => fmt(d, { month: 'short' }).toUpperCase();
export const monthYear = (d: Date) => fmt(d, { month: 'long', year: 'numeric' });

export function dateRange(start: Date, end: Date): string {
  return `${shortDate(start)} – ${shortDate(end)}`;
}

/** "14:30" → "2:30pm" */
export function time12(t?: string): string {
  if (!t) return '';
  const m = /^(\d{1,2})[:.](\d{2})$/.exec(t.trim());
  if (!m) return t;
  let h = Number(m[1]);
  const suffix = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${m[2]}${suffix}`;
}

export function timeRange(a?: string, b?: string): string {
  if (a && b) return `${time12(a)} – ${time12(b)}`;
  return time12(a || b);
}

/** Drafts show while developing locally, never on the live site. */
export const showDrafts = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';
export const visible = <T extends { data: { draft?: boolean } }>(e: T) => showDrafts || !e.data.draft;

export async function exhibitionsByStatus() {
  const today = todayISO();
  const all = (await getCollection('exhibitions')).filter(visible);
  const current = all.filter((e) => iso(e.data.start) <= today && iso(e.data.end) >= today).sort((a, b) => +a.data.end - +b.data.end);
  const upcoming = all.filter((e) => iso(e.data.start) > today).sort((a, b) => +a.data.start - +b.data.start);
  const past = all.filter((e) => iso(e.data.end) < today).sort((a, b) => +b.data.end - +a.data.end);
  return { current, upcoming, past };
}

export async function datedByStatus<C extends 'events' | 'workshops'>(name: C) {
  const today = todayISO();
  const all = (await getCollection(name)).filter(visible);
  const upcoming = all.filter((e) => iso(e.data.date) >= today).sort((a, b) => +a.data.date - +b.data.date);
  const past = all.filter((e) => iso(e.data.date) < today).sort((a, b) => +b.data.date - +a.data.date);
  return { upcoming, past };
}

/** Closures whose date range includes today. */
export function activeClosures() {
  const today = todayISO();
  return (settings.closures as Array<{ from: string; to: string; message: string }>).filter(
    (c) => c.from && c.to && c.from <= today && c.to >= today,
  );
}

export function addressLine(): string {
  const a = settings.address;
  return [a.street, a.town, `${a.state} ${a.postcode}`.trim()].filter(Boolean).join(', ');
}

export const mailto = () => `mailto:${settings.email}`;
export const telHref = () => `tel:${settings.phone.replace(/[^\d+]/g, '')}`;

/** Earthy placeholder tones from the logo, used where a photo hasn't been added yet. */
export const tones = ['#8f2f22', '#4f5b32', '#5a3f2b', '#2f4a52', '#7a5a1e', '#3d3550', '#a8693a', '#6b7a2e'];
export const tone = (i: number) => tones[i % tones.length];
