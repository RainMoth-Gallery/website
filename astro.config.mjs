// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import settings from './src/data/settings.json' with { type: 'json' };

// The site address comes from Site Settings in the admin page,
// so it is never hard-coded anywhere else in the project.
export default defineConfig({
  site: settings.siteUrl,
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/thanks/') && !page.endsWith('/whats-on/') })],
});
