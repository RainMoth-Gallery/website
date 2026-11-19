# Rain Moth Gallery website

The website for Rain Moth Gallery, Waikerie: [rainmoth.org](https://rainmoth.org).

Built with [Astro](https://astro.build), hosted free on Cloudflare, and edited through [Pages CMS](https://pagescms.org). All content lives as plain files in this repository, with no database.

## Editing content (for gallery volunteers)

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Open **RainMoth-Gallery / website**.
3. Choose a section in the sidebar: Exhibitions, Events, Workshops, Artists, Public Art, Homepage, Gallery Shop page, About & History, or **Site Settings** (hours, closures, contact details, social links).
4. Make your changes and click **Save**. The live site updates within a minute or two.

Tips:
- **Draft** hides an entry from the live site until you're ready.
- Finished exhibitions, events and workshops move to "Past" automatically. You don't need to delete them.
- **Temporary closures** (in Site Settings) show a banner across every page between two dates, then disappear by themselves.
- Times are 24-hour, e.g. `14:30` for 2:30pm.
- Upload photos as JPG, ideally no wider than 2000px.

To give another volunteer editing access, add them as a collaborator in Pages CMS (or add their GitHub account to the RainMoth-Gallery organisation).

## One-time setup

### 1. Cloudflare (hosting)
The site is hosted as a Cloudflare Worker serving static files (config in `wrangler.jsonc`).
1. Cloudflare dashboard → **Workers & Pages** → **Create** → import `RainMoth-Gallery/website` from GitHub.
2. Build command `npm run build`, deploy command `npx wrangler deploy`, path `/`.
3. Build variable: `NODE_VERSION` = `22`.
4. Deploy, then in the Worker: **Settings** → **Domains & Routes** → add custom domain `rainmoth.org` (and `www.rainmoth.org`).

### 2. Daily rebuild (keeps "What's On" current)
1. In the Worker: **Settings** → **Builds** → **Deploy Hooks** → create a hook named `daily` for branch `main`. Copy the URL.
2. In GitHub: repository **Settings** → **Secrets and variables** → **Actions** → **New repository secret**, named `CLOUDFLARE_DEPLOY_HOOK`, with the URL as the value.

The workflow in `.github/workflows/daily-rebuild.yml` then rebuilds the site every night just after midnight Adelaide time.

### 3. Contact forms (Web3Forms)
1. Go to https://web3forms.com, enter the gallery's email address and get an access key.
2. In Pages CMS → **Site Settings** → paste it into **Web3Forms access key** and save.

Until a key is added, the forms show the gallery's email address and phone number instead.

### 4. Pages CMS
Sign in at https://app.pagescms.org with GitHub and give it access to the `RainMoth-Gallery` organisation. The admin layout comes from `.pages.yml`.

## For developers

```sh
npm install
npm run dev       # http://localhost:4321, shows draft entries too
npm run build     # production build into dist/
```

Set `PUBLIC_SHOW_DRAFTS=true` to include draft entries in a build (useful for preview deployments).

| Path | What's in it |
| --- | --- |
| `src/data/settings.json` | Site Settings: name, site address, hours, closures, contact details, socials, form key |
| `src/data/home.json`, `src/data/shop.json` | Homepage and Gallery Shop page content |
| `src/content/*` | Exhibitions, events, workshops, artists, public art, About & History (Markdown) |
| `public/images/uploads` | Photos uploaded through Pages CMS |
| `src/pages` | Page templates |
| `src/styles/global.css` | All styling (colours from the logo, Poppins font) |
| `.pages.yml` | Admin page (Pages CMS) configuration |

The site address is set only in Site Settings (`siteUrl`). Links between pages are relative, so the site works on any domain.
