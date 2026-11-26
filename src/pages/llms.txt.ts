import type { APIRoute } from 'astro';
import { settings, exhibitionsByStatus, datedByStatus, addressLine, dateRange, longDate, timeRange } from '../lib/site';

// A short plain-text summary of the site for AI tools. Built from the same content as the pages,
// and rebuilt with the site every night, so it never needs editing by hand.
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const { current, upcoming } = await exhibitionsByStatus();
  const events = (await datedByStatus('events')).upcoming;
  const workshops = (await datedByStatus('workshops')).upcoming;

  const hours = (settings.hours as Array<{ day: string; closed: boolean; open: string; close: string }>)
    .map((h) => `- ${h.day}: ${h.closed || !h.open ? 'Closed' : `${h.open} to ${h.close}`}`)
    .join('\n');

  const lines: string[] = [
    `# ${settings.siteName}`,
    '',
    `> ${settings.tagline}`,
    '',
    `${settings.siteName} is run by ${settings.organisation.replace(/\.$/, "")}. Address: ${addressLine()}. Phone: ${settings.phone}. Email: ${settings.email}.`,
    '',
    '## Opening hours (Adelaide time, 24-hour)',
    hours,
    ...(settings.hoursNote ? ['', settings.hoursNote] : []),
    '',
    '## Pages',
    `- [Exhibitions](${url('/whats-on/exhibitions/')}): current, upcoming and past exhibitions`,
    `- [Events](${url('/whats-on/events/')}): openings, talks and special events`,
    `- [Workshops](${url('/whats-on/workshops/')}): workshops and demonstrations`,
    `- [Artists](${url('/artists/')}): local artists and makers`,
    `- [Public Art](${url('/public-art/')}): public art around Waikerie`,
    `- [Gallery Shop](${url('/gallery-shop/')}): handmade work by local makers (enquiries only, no online sales)`,
    `- [About](${url('/about/')})`,
    `- [Contact and visit](${url('/contact-visit/')})`,
  ];

  if (current.length) {
    lines.push('', '## On now');
    current.forEach((e) => lines.push(`- [${e.data.title}](${url(`/whats-on/exhibitions/${e.id}/`)}): ${dateRange(e.data.start, e.data.end)}${e.data.summary ? `. ${e.data.summary}` : ''}`));
  }
  if (upcoming.length) {
    lines.push('', '## Coming up');
    upcoming.forEach((e) => lines.push(`- [${e.data.title}](${url(`/whats-on/exhibitions/${e.id}/`)}): ${dateRange(e.data.start, e.data.end)}${e.data.summary ? `. ${e.data.summary}` : ''}`));
  }
  if (events.length) {
    lines.push('', '## Upcoming events');
    events.forEach((e) => lines.push(`- ${e.data.title}: ${[longDate(e.data.date), timeRange(e.data.startTime, e.data.endTime)].filter(Boolean).join(', ')}`));
  }
  if (workshops.length) {
    lines.push('', '## Upcoming workshops');
    workshops.forEach((w) => lines.push(`- ${w.data.title}: ${[longDate(w.data.date), timeRange(w.data.startTime, w.data.endTime)].filter(Boolean).join(', ')}`));
  }

  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
