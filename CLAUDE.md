# CLAUDE.md — contractor-template
# Location: ~/projects/contractor-template/CLAUDE.md
# Inherits from ~/.claude/CLAUDE.md

---

## Project: FreshSitez Contractor Template
Astro 6.x static site template for home service contractors. Deployed per client on Vercel. All content controlled by a single config file. This is the master template — every paying FreshSitez client gets a clone of this repo with their own `business.config.js`.

---

## Tech Stack
- **Framework**: Astro 6.x (static output)
- **Styling**: Tailwind CSS 4.x + inline styles (no separate CSS files per component)
- **Deployment**: Vercel (auto-deploy on push to main)
- **Repo**: GitHub — `nho3pcc/contractor-template`
- **Config**: `src/business.config.js` — THE ONLY FILE n8n edits at scale
- **Fonts**: Montserrat (headings 900wt) + Roboto (body) via Google Fonts
- **CRM**: GoHighLevel (GHL) — embeds injected via business.config.js

---

## Key Commands
```bash
npm run dev      # Dev server at localhost:4321
npm run build    # Production build
npm run preview  # Preview production build locally
git add . && git commit -m "message" && git push  # Deploy (Vercel auto-deploys on push)
```

---

## File Structure
```
contractor-template/
├── src/
│   ├── pages/
│   │   ├── index.astro        — Homepage (hero, services, process, about, gallery, reviews, areas)
│   │   ├── services.astro     — Services listing page
│   │   ├── services/
│   │   │   └── [slug].astro   — Dynamic service detail pages (getStaticPaths from config)
│   │   ├── gallery.astro      — Photo gallery
│   │   ├── about.astro        — About page
│   │   ├── contact.astro      — Contact page with GHL form + calendar
│   │   └── review.astro       — Review gate page (4-5 stars → GMB, 1-3 → internal)
│   ├── layouts/
│   │   └── Layout.astro       — Global layout, fonts, meta, chat widget inject
│   ├── styles/
│   │   └── global.css         — Design tokens, utility classes
│   └── business.config.js     — ⚠️ THE ONLY FILE n8n EDITS — all client content lives here
├── public/                    — Static assets
├── CLAUDE.md                  — This file
├── PROJECT.md                 — Business context
└── astro.config.mjs
```

---

## Architecture Rules — CRITICAL

### The Golden Rule
`business.config.js` is the ONLY file that changes between clients. n8n clones this repo and edits ONLY that file. Every feature must be configurable from there. If something can't be driven from `business.config.js`, redesign it.

### GHL Embeds — Astro Quirk
Astro strips `<script>` tags from `set:html` for security. Workarounds in use:
- **Chat widget**: Hardcoded in `Layout.astro` with `is:inline` — uses `business.ghlChatWidgetId` to construct the script
- **Forms**: Use `<iframe is:raw ...>` with `<script is:inline src="...">` — NOT `Fragment set:html`
- **Calendar**: Same as forms — `<iframe is:raw>`
- **NEVER** use `<Fragment set:html={business.ghlFormEmbed}>` for scripts — it will silently fail

### Forms → GHL
- Contact / homepage / review forms → `ghlWebhookUrl` (WF02: contact creation + welcome SMS)
- Photo form (`/photo`) → `ghlPhotoWebhookUrl` (WF07: contact creation + photo field mapping + welcome SMS + contractor notification)

WF07 handles everything for photo leads — WF02 is not involved. No GHL iframe embeds for forms — custom styled forms with webhook delivery. This means:
- Forms look native to the site
- Submissions hit GHL inbound webhook → creates contact → fires workflows → notifies client on LeadConnector app
- No CORS issues, no iframe sizing problems

### Navigation
ALL nav and CTA links use page routes, never anchor links:
- ✅ `href="/contact"`
- ❌ `href="#contact"`

### Design System
```
--primary:  #182240  (deep navy — backgrounds)
--accent:   #F2CA52  (yellow/gold — CTAs, highlights)
--black:    #000000  (alternating sections)
--white:    #ffffff  (text, light backgrounds)
Font heading: Montserrat 900 uppercase
Font body: Roboto 400/500
Button radius: 5px
```

---

## business.config.js Field Reference
```javascript
// Core identity
name, tagline, subtagline, description
phone, email, address, city, state, zip

// Branding
primaryColor, accentColor, logoUrl, heroImageUrl

// Content arrays
galleryImages[]           — photo URLs
badges[]                  — trust badges (text)
services[]                — { name, icon, slug, description, longDescription, image, serviceImages[], faqs[] }
process[]                 — { step, title, desc }
reviews[]                 — { name, location, text }
serviceAreas[]            — city name strings

// Social & review
socialLinks[]             — { platform, url, label }
googleReviewUrl           — direct GMB review link
reviewPlatforms[]         — { name, url } — where 4-5 star reviews go

// GHL integrations
ghlWebhookUrl             — inbound webhook for all forms (Workflow 02: contact creation + welcome SMS)
ghlPhotoWebhookUrl        — photo-only webhook (Workflow 07: photo intake). Leave "" until WF07 is created in GHL
ghlChatWidgetId           — widget ID only (script constructed in Layout.astro)
ghlCalendarUrl            — calendar booking URL for iframe

// Maps
googleMapsApiKey          — single key works for all sites

// Hours
hours, emergency (boolean)

// Photo diagnosis page
photoPageEnabled          — boolean, shows /photo page + nav link
aiDiagnosisEnabled        — boolean, enables Path B (Claude Vision)
anthropicApiKey           — use Vercel env ANTHROPIC_API_KEY instead in prod
cloudinaryCloudName       — Cloudinary cloud name for photo uploads
cloudinaryUploadPreset    — unsigned upload preset name (Settings → Upload in Cloudinary)
```

---

## Environment Variables
No env vars needed in the Astro template itself — all config comes from `business.config.js`.

For future n8n automation scripts that interact with this repo:
```
GITHUB_TOKEN=        # For n8n to clone/push repos
VERCEL_TOKEN=        # For n8n to trigger deploys
GHL_API_KEY=         # For n8n to create sub-accounts
ANTHROPIC_API_KEY=   # For Claude Haiku copy generation
GOOGLE_MAPS_API_KEY= # Baked into business.config.js per site (not secret)
```
Store all of these in WSL: `~/.bashrc` as `export VAR=value`

---

## Known Gotchas
- Astro strips scripts from `set:html` — always use `is:inline` or `is:raw`
- GHL iframe embeds need the form_embed.js script loaded alongside them
- Vercel auto-deploys on every push to main — no staging environment currently
- `npm run dev` runs on localhost:4321, not 3000
- WSL file path from Windows: `\\wsl$\Ubuntu\home\nsho1\projects\contractor-template`
- The Gemini AI broke this repo once by componentizing index.astro — always check `git status` before accepting outside AI changes

---

## Build Process
1. Always start in Plan Mode — present a plan before writing any code
2. Wait for my approval of the plan before proceeding
3. After building, invoke the code-reviewer skill on all changed files
4. Do not deploy unless I explicitly say /deploy

---

## Skills
**Use for this project:**
- `front-end-design` — all UI and template work
- `code-reviewer` — run after every build session
- `vercel` — deploy commands only
- `github` — all repo operations

**Not needed here:**
- `supabase` — no database in this repo; forms POST directly to GHL webhook
- `playwright` — only needed when screenshot comparison is explicitly requested

---

## How I Want You to Work (Project-Specific)
- After completing any visual change, use Playwright to screenshot localhost:4321
  and compare against the relevant reference image in docs/reference/ before
  marking the task done — if it doesn't match closely enough, self-correct before finishing
- npm run dev must be running in a separate terminal tab for Playwright to work —
  do not kill it during a session

---

## How Norman Communicates Requests

### Screenshot Workflow
- Annotated edit requests live in `/docs/adjustments/`
- Filenames are auto-timestamped by Awesome Screenshot Chrome extension
- Format example: `DR-Pressure-The-Power-Washing-Experts-03-26-2026_11_14_AM.png`
- Format pattern: `{Page-Title}-{MM}-{DD}-{YYYY}_{HH}_{MM}_{AM/PM}.png`
- Latest timestamp = most current request — compare MM/DD/YYYY then HH_MM_AM/PM to determine order
- If multiple screenshots exist for the same feature, the **latest timestamp wins** — earlier ones are superseded
- Cross-reference `/docs/adjustments/README.md` for priority order and context notes
- When a task is complete, mark it done in the README — do not delete the file

### Reference vs Adjustments
- `/docs/reference/` — Glassperts screenshots showing what to BUILD TOWARD (aspirational)
- `/docs/adjustments/` — Norman's annotated screenshots showing what to FIX (actionable)
- Never "fix" something to match reference unless an adjustments screenshot says to

### Adjustments README Format
`/docs/adjustments/README.md` should be maintained as a simple checklist:

​```md
## Open
- [ ] DR-Pressure-The-Power-Washing-Experts-03-26-2026_11_14_AM.png — service grid hover rebuild
- [ ] DR-Pressure-The-Power-Washing-Experts-03-26-2026_11_45_AM.png — review gate page

## Done
- [x] DR-Pressure-The-Power-Washing-Experts-03-25-2026_09_30_AM.png — native form replacing GHL iframe
​```

Claude Code updates this file after completing each task — mark done, never delete.
To sort by recency: parse as MM-DD-YYYY then HH_MM AM/PM — do NOT sort alphabetically.

---

## Current Status
- **Complete (Phase 1)**: All pages built and mobile-responsive (index, services, services/[slug], gallery, about, contact, review, photo). Layout.astro, global.css, business.config.js fully configured. Chat widget (is:inline), GHL webhook forms, hamburger nav, popup quote modal all working. Photo page uploads to Cloudinary then POSTs Cloudinary URL + photoLeadSource to GHL webhook.
- **In Progress**: Service cards with photo + hover (Glassperts style), review gate page improvements
- **Known Issues**: Contact page calendar embed may not render — same Astro script stripping issue
- **Next Up**: Rebuild service grid (Glassperts hover style), expand review gate page

### Photo Upload Flow
`/photo` page: user selects image → resized client-side to 1024px JPEG → uploaded to Cloudinary (unsigned preset) → `secure_url` included in GHL webhook POST as `photoUrl` field alongside `photoLeadSource: "Website Form"`. If Cloudinary upload fails, lead is still submitted without photo URL.

---

## Reference
- Live demo: `contractor-template-two.vercel.app`
- Design reference: `glassexpertsfl.org` (service cards, review widget, popup form style)
- GHL sub-account: FreshSitez (TapIQ) — Glendale, CA
- Snapshot saved: "FreshSitez Master v2" — pending manual creation in app.tapiq.ai → Settings → Snapshots (captures workflows, custom fields, pipeline settings after photo URL fix)

---

## FreshSitez Security Notes
- business.config.js contains NO secrets — only public-facing content
- Google Maps API key lives in Vercel env as GOOGLE_MAPS_API_KEY
- Contact forms POST to ghlWebhookUrl; photo form POSTs to ghlPhotoWebhookUrl — sanitize all fields client-side before sending
- Source maps must be disabled in production builds
- GitHub repos must stay private — never push with visibility set to public
- After every session: invoke code-reviewer on all changed files, fix any bugs found, report any security issues before closing
## Approach
- Think before acting. Read existing files before writing code.
- Be concise in output but thorough in reasoning.
- Prefer editing over rewriting whole files.
- Do not re-read files you have already read.
- Test your code before declaring done.
- No sycophantic openers or closing fluff.
- Keep solutions simple and direct.
- User instructions always override this file.
