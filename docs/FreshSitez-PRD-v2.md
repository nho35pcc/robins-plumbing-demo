# FreshSitez.com — Product Requirements Document
**Version 2.2 | Updated 2026-04-04**
**Operator: MayWenti LLC | Norman Ho**

---

## 1. Product Overview

FreshSitez.com is an automated website generation and marketing system agency targeting home service and contractor businesses. The core product is a templated, high-converting Astro website pre-wired with GoHighLevel (GHL) automations, delivered at $297/month with minimal human intervention through an AI-powered pipeline.

Validated by Stone Systems (stonesystems.io) — 7-figures ARR serving hundreds of contractors at $297/month manually. FreshSitez replicates and improves on this model using automation to reduce cost per acquisition and cost per delivery.

The system is designed to run largely autonomously — finding prospects, building personalized preview sites, sending outreach, closing sales, and onboarding clients — with a human reviewing edge cases.

---

## 2. Strategic Context

### Parent Company
**MayWenti LLC** — umbrella entity. FreshSitez operates as a brand under MayWenti.

### Sibling Products
- **FirstResponseOS** — AI voice agent for emergency/restoration contractors. $1k-3k setup, $500-1k/month. FreshSitez clients are the natural upsell target.
- **StreetScout AI** — OpenClaw-based lead gen for luxury realtors. Separate vertical.

### Positioning
FreshSitez is the volume entry point into the MayWenti ecosystem. Low-friction $297/month product → establishes trust → natural upsell to FirstResponseOS. Hormozi framework: cheap entry, premium AI upsell after results are proven.

---

## 3. Ideal Customer Profile (ICP)

### Tier 1 Niches (Highest Priority)
- Restoration contractors (water damage, fire, mold) — FirstResponseOS upsell target
- Plumbers — emergency calls, owner-operated, universally bad websites
- HVAC — seasonal demand, missed calls are painful
- Electricians — licensed trade, high ticket, phone dependent
- Roofers — storm surges, high job values
- Pest control — recurring revenue, phone dependent
- Garage door repair — emergency service, 24/7 calls
- Locksmiths — emergency only, phone is everything

### Tier 2 Niches
- Landscaping/lawn care
- Pressure washing
- Pool service
- Auto detailing

### ICP Characteristics
- Owner-operated, 1-10 employees
- Revenue $200k-$2.5M/year
- No website OR bad website (GoDaddy, Wix, Squarespace, outdated)
- Has GMB listing with reviews
- Phone is primary lead channel
- Owner is decision maker
- US metro or suburban market
- Already paying for leads (Angi, Thumbtack) — proven marketing spend

### Negative ICP
- Restaurants, retail, medical/dental, real estate agents
- Businesses with active modern websites

### Hot Prospect Signals
- Active GMB with 50+ reviews but no website
- GoDaddy/Wix site with PageSpeed under 40
- High review count, low GMB response rate
- Recently joined Angi/Thumbtack

---

## 4. Product Description

### Core Deliverable
A multi-page Astro website deployed on Vercel, pre-wired with GoHighLevel automations, delivered as a subdomain preview for prospects and full site for paying clients.

### Pages Included
1. **Homepage** — Hero with lead capture form, trust badges, photo service grid, process steps, about, gallery, reviews, service areas, footer CTA
2. **Services** — Service listing with descriptions
3. **Services/[slug]** — Dynamic SEO service detail pages (one per service)
4. **Gallery** — Photo grid
5. **About** — Company story, badges, reviews
6. **Contact** — GHL form, map, hours, service areas, calendar
7. **Review** — Review gate page (4-5 stars → GMB, 1-3 stars → internal feedback)
8. **Photo Diagnosis** (`/photo.astro`) — Dual-path lead capture page. 
Two options: "Send photo to [contractor]" or "Get AI diagnosis." Both 
paths require opt-in (name, phone, email, address) before proceeding. 
Send path submits directly to GHL webhook. AI path sends photo to 
Claude Vision API, displays diagnosis with CTA, then POSTs contact 
info + photo URL + AI summary to GHL webhook simultaneously. No n8n 
required — all handled client-side via fetch().

### GHL Automations Included (via snapshot)
- Missed call text back (within 2 min)
- New lead welcome (immediate SMS + email)
- Lead follow-up Day 1 (24hr)
- Lead follow-up Day 3 (48hr)
- Review request (post-job)
- Appointment reminder (24hr + 1hr)
- All-in-one inbox (SMS, email)
- Business phone number (local)
- LeadConnector mobile app
- Visual pipeline
- Photo intake + follow-up (Workflow 7) — captures photo leads from 
  SMS, email, or website form; collects name + address via casual 
  follow-up text; follow-up mode is contractor-configurable: "auto" 
  sends follow-up after 48hrs with no input, "approval" texts 
  contractor first and waits for YES/NO reply
- Review gate (post-job) — contractor marks job complete, system 
  sends SMS to customer linking to /review.astro; 4-5 stars routes 
  to Google review, 1-3 stars routes to internal feedback form only

### GHL Integration Architecture
| Element | Method |
|---|---|
| Chat widget | `is:inline` script in Layout.astro |
| Lead capture form | `fetch()` POST to `ghlWebhookUrl` (WF02) |
| Calendar | `<iframe is:raw>` embed |
| Contact form | `fetch()` POST to `ghlWebhookUrl` (WF02) |
| Review feedback form | `fetch()` POST to `ghlWebhookUrl` (WF02) |
| Photo diagnosis form | `fetch()` POST to `ghlPhotoWebhookUrl` (WF07 handles everything: contact creation + photo fields + welcome SMS) + Claude Vision API |

### business.config.js Feature Toggles
These fields control per-client feature availability:

| Field | Type | Default | Purpose |
|---|---|---|---|
| `photoPageEnabled` | boolean | true | Enables /photo.astro page |
| `aiDiagnosisEnabled` | boolean | true | Enables AI diagnosis path on photo page |
| `followUpMode` | string | "approval" | "auto" sends follow-up automatically after 48hrs; "approval" texts contractor first and waits for YES/NO |

**Key decision:** All forms use custom-styled HTML that POSTs to GHL inbound webhook — NOT GHL iframe embeds. Reason: eliminates Astro script stripping issues, no CORS problems, fully custom styled.

### Technical Specifications
- **Framework:** Astro 6.x static output
- **Styling:** Tailwind CSS 4.x + inline styles
- **Hosting:** Vercel (auto-deploy on GitHub push)
- **Repo:** GitHub (cloned per client from master template)
- **Config:** Single `business.config.js` — THE ONLY FILE n8n edits
- **Fonts:** Montserrat 900 (headings) + Roboto (body) via Google Fonts
- **Design:** Navy `#182240`, accent yellow `#F2CA52`, black sections
- **Map:** Google Maps Embed API (one key, all sites)
- **Performance:** 90+ Lighthouse score
- **Mobile:** Fully responsive
- **Dev environment:** Cursor + Claude Code in WSL Ubuntu on Windows 11

---

## 5. business.config.js Schema (Current + Planned)

```javascript
export const business = {
  // Core identity
  name, tagline, subtagline, description,
  phone, email, address, city, state, zip,

  // Branding
  primaryColor, accentColor, logoUrl, heroImageUrl,

  // Content
  galleryImages[],           // photo URLs
  badges[],                  // trust badge text strings

  // Services (expanded)
  services: [{
    name, icon, slug,
    description,             // short — shown on hover card
    longDescription,         // full — shown on service detail page
    image,                   // service card background photo
    serviceImages[],         // gallery on detail page
    faqs[{ q, a }]          // FAQ accordion on detail page
  }],

  process[{ step, title, desc }],
  reviews[{ name, location, text }],
  serviceAreas[],

  // Social (variable per client)
  socialLinks[{ platform, url, label }],

  // Review gate
  googleReviewUrl,
  reviewPlatforms[{ name, url }],

  // GHL
  ghlWebhookUrl,             // inbound webhook — all forms POST here (WF02: contact creation + welcome SMS)
  ghlPhotoWebhookUrl,        // photo-only webhook (WF07: photo intake). Leave "" until WF07 is created in GHL
  ghlChatWidgetId,           // widget ID only — script built in Layout.astro
  ghlCalendarUrl,            // calendar booking URL for iframe

  // Maps
  googleMapsApiKey,

  // Hours
  hours, emergency,

  // Feature toggles
  photoPageEnabled,        // boolean — enables /photo.astro
  aiDiagnosisEnabled,      // boolean — enables AI diagnosis path
  followUpMode,            // "auto" | "approval"
}
```

---

## 6. Pricing & Monetization

### Entry Offer
**$297/month** — Website + GHL automations + LeadConnector app
- No setup fee
- Month-to-month
- Billed via Stripe (recurring)
- Can also create payment link inside GHL (Agency plan supports this)

### Upsell 1 — FirstResponseOS Voice AI
**+$197-297/month**
- AI answers every call 24/7, qualifies leads, books appointments
- Pitch at 30-60 days after proven results

### Upsell 2 — Lead Generation (OpenClaw)
**+$500+/month**
- Actively finds and contacts leads in their service area
- Pitch at 60-90 days

### Client LTV Targets
| Plan | Monthly Revenue |
|---|---|
| Base only | $297 |
| Base + Voice AI | $494-594 |
| Base + Voice AI + Lead Gen | $994-1,094 |

### GHL Plan Decision
**Agency $297/month** — sufficient for all phases. SaaS mode ($497) not needed because Stripe handles billing directly. Revisit SaaS mode at 50+ clients.

---

## 7. Automation Pipeline Architecture

### Tool Stack
| Tool | Role |
|---|---|
| **n8n** | Orchestration, API calls, scheduling |
| **Claude API (Opus/Haiku)** | Personalization, copy generation, scoring, reply handling |
| **Ideogram** | AI logo generation fallback |
| **GitHub API** | Template cloning, config injection |
| **Vercel API** | Deploy triggering, domain pre-registration |
| **GHL API** | Sub-account creation, contact management |
| **Instantly** | Cold email at volume |
| **Pitchlane** | Personalized video outreach |
| **Retell AI** | Outbound voice + voicemail drops |
| **Slydial** | Direct-to-voicemail |
| **PostGrid/Lob** | Physical mail (Day 21) |
| **Stripe** | Payment processing |
| **Airtable** | Prospect DB, pipeline, review queue |
| **Cloudinary** | Photo storage for /photo page uploads |
| **Google Places API** | Business discovery |
| **WHOIS API** | Registrar detection for DNS onboarding |

*Note: GPT-4o removed from stack — Claude handles all AI tasks. Single vendor, simpler.*

### Flow Summary
1. **Prospector** — scrapes Google/Yelp nightly, scores prospects, writes to Airtable
2. **Brand Extractor** — finds/generates logo, extracts colors, uploads assets
3. **Site Builder** — clones template, injects config, deploys to Vercel
4. **Quality Judge** — screenshots site, GPT-4o Vision scores it, routes to review queue or outreach
5. **Outreach Builder** — generates email copy, adds to Instantly campaign
6. **Reply Handler** — classifies replies, routes INTERESTED → payment link
7. **Onboarding** — Stripe webhook → GHL sub-account → config update → redeploy → welcome email

---

## 8. Build Status & Phases

### Phase 1 — Make It Sellable
- [x] Astro template (8 pages) built and deployed
- [x] GitHub + Vercel auto-deploy
- [x] business.config.js fully stubbed with expanded schema
- [x] GHL sub-account configured (phone, pipeline, fields, workflows, form, widget, calendar)
- [x] 6 workflows published
- [x] GHL chat widget live on all pages (is:inline)
- [x] All forms via fetch() POST to ghlWebhookUrl (no GHL iframes)
- [x] All nav/footer links using page routes
- [x] A2P registration submitted
- [x] freshsitez.com live
- [x] hello@freshsitez.com configured
- [x] Privacy policy + terms live
- [ ] GHL snapshot saved ("FreshSitez Master v2" — updated from v1)
- [ ] Stripe + $297/month payment link ← DO THIS NOW, before template polish
- [ ] Google Maps API key configured
- [ ] Full form→GHL→SMS flow tested end to end

### Phase 2-T — Template Feature Upgrades (Claude Code)
- [x] Expand business.config.js (socialLinks, reviewPlatforms, expanded services[], cloudinary fields)
- [x] Hamburger nav — mobile, all pages
- [x] Fully mobile responsive — all pages (375px tested)
- [x] Popup modal form on all CTA buttons → fetch() POST to ghlWebhookUrl
- [x] Social links widget on homepage about section
- [x] /review.astro — review gate page
- [x] /services/[slug].astro — dynamic service detail pages with FAQ accordion
- [x] /photo.astro — dual-path photo diagnosis + Cloudinary upload + GHL webhook
- [ ] Service grid → 2x2 photo cards with hover description (Glassperts style) ← next
- [ ] SEO copy generation per service (Claude, city-targeted)

### Phase 3 — Stripe
- [ ] Stripe account + $297/month product
- [ ] Payment link generated
- [ ] GHL Stripe integration connected

### Phase 4 — First Clients Manually
- [ ] 10 prospects identified
- [ ] Preview sites built manually
- [ ] Outreach sent via Pitchlane + Instantly
- [ ] First 1-3 clients closed

### Phase 5 — Automate Site Creation
- [ ] n8n Cloud set up
- [ ] Airtable base built
- [ ] Flows 1-4 built and tested

### Phase 6 — Automate Outreach
- [ ] Cold email domains + warmup
- [ ] Instantly campaigns
- [ ] GHL SMS sequences
- [ ] Retell AI voice
- [ ] Reply handler workflow

### Phase 7 — Automate Onboarding
- [ ] Stripe → n8n webhook
- [ ] GHL sub-account creation automated
- [ ] Config injection automated
- [ ] Welcome email automated

### Phase 8 — FreshSitez Marketing Site
- [ ] Build out freshsitez.com fully (currently live with placeholder content)
- [ ] Portfolio section with client site screenshots
- [ ] Stripe payment link prominent
- [ ] "Get free preview" form → triggers brand extractor

### Phase 9 — Customer Self-Service Portal
- [ ] Build at 10-20+ clients
- [ ] Magic link auth
- [ ] Editable fields: name, phone, hours, photos, services, service areas
- [ ] Domain connection flow with registrar detection
- [ ] n8n webhook → GitHub → Vercel auto-deploy on save

---

## 9. Design System

### Colors
- `--primary: #182240` — deep navy, main backgrounds
- `--accent: #F2CA52` — yellow/gold, all CTAs and highlights
- `--black: #000000` — alternating sections
- `--white: #ffffff` — text and light backgrounds

### Typography
- Headings: Montserrat, weight 900, uppercase, tight letter-spacing
- Body: Roboto, weight 400/500

### Homepage Section Order
Nav → Hero (with form) → Trust bar → Services → Process → About → Gallery → Reviews → Service areas → Footer CTA → Footer

### Key Conversion Rules
- Form visible above fold in hero — non-negotiable
- Phone number clickable in nav — non-negotiable
- Trust badges immediately below hero
- All CTA buttons trigger popup form modal (post Phase 2-T)

---

## 10. Repository Structure

```
contractor-template/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── services.astro
│   │   ├── services/[slug].astro    ← dynamic, from business.services[]
│   │   ├── gallery.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── review.astro             ← review gate
│   │   └── photo.astro              ← photo diagnosis + lead capture
│   ├── layouts/
│   │   └── Layout.astro             ← global, chat widget here
│   ├── styles/
│   │   └── global.css
│   └── business.config.js           ← ⚠️ ONLY FILE n8n EDITS
├── docs/
│   ├── PRD.md
│   ├── BuildGuide.md
│   └── reference/                   ← Glassperts screenshots
├── public/
├── CLAUDE.md                        ← Claude Code context
└── astro.config.mjs
```

---

## 11. Cost Structure

### Per-Prospect Variable Costs
| Item | Cost |
|---|---|
| Lead scraping + scoring | ~$0.001 |
| Brand extraction | ~$0.03-0.15 |
| Site generation + deploy | ~$0.01 |
| Quality judging | ~$0.005 |
| Copy generation | ~$0.05 |
| Pitchlane video | ~$0.15-0.25 |
| Email + SMS | ~$0.02 |
| **Total per prospect** | **~$0.25-0.50** |

### Monthly Fixed Costs (at full operation)
| Tool | Cost |
|---|---|
| GHL Agency | $297 |
| Claude Max | $100 |
| n8n Cloud | $20 |
| OpenClaw | $50-100 |
| Vercel Pro | $20 |
| Instantly | $37 |
| Pitchlane | $37-67 |
| Claude/GPT API | $30-50 |
| Cold email domains | $10 |
| **Total** | **~$620-750/mo** |

**Break-even: 3 clients**

---

## 12. Revenue Targets

| Clients | MRR | Timeline |
|---|---|---|
| 1 | $297 | Week 3-4 |
| 3 | $891 | Month 2 |
| 10 | $2,970 | Month 2-3 |
| 50 | $14,850 | Month 4-5 |
| 100 | $29,700 | Month 6-8 |

---

## 13. Risk Factors

| Risk | Mitigation |
|---|---|
| Email deliverability | Domain rotation, Mailreach warmup, <500/day/domain |
| GHL API changes | Monitor changelog, iframe fallbacks |
| SMB seasonal churn | Annual billing option, FirstResponseOS upsell stickiness |
| OpenClaw rate limiting | Rotate proxies, use official APIs where available |
| Logo extraction failure | 5-image cap, AI generation fallback, fast review queue |

---

## 14. Future Expansion

### Niche Expansion
Same architecture, different configs. Next niches: commercial cleaning, chimney sweep, window cleaning, junk removal, moving companies.

### Geographic Expansion
Start LA/Glendale → expand metro by metro.

### Template Variants
2-3 visual templates: dark/bold (current), clean/light professional, emergency/urgent. Match to niche automatically.

### White Label
At proven volume: offer the system white-labeled to marketing agencies. Platform fee, they build their own client base.

---

## 15. Key Reference Sites

- **Validated model:** stonesystems.io
- **Design reference:** glassexpertsfl.org (service cards, popup form, review widget)
- **Live demo:** contractor-template-two.vercel.app
- **Marketing site:** freshsitez.com

---

## 16. Decisions Log

| Decision | Rationale |
|---|---|
| Single-file pages, no componentization | Simpler for n8n injection, fewer failure points |
| Forms via fetch() not GHL iframe | No Astro stripping issues, custom styling |
| Chat widget via is:inline | Only way to make GHL script work in Astro |
| Agency $297 not SaaS $497 | Stripe handles billing, n8n handles onboarding — SaaS mode unnecessary |
| No blog | Static /services/[slug] pages for SEO instead |
| Astro over Next.js | Static = faster, simpler, 90+ Lighthouse out of box |
| Claude Max $100 | Usage limit on Pro interrupted build sessions |
| WSL Ubuntu for all dev | Claude Code runs faster on Linux |
| Calendar CTA primary in Phase 4 | Sell manually first, learn objections before switching to payment-link-first |
| Pitchlane page has both buttons from day one | Calendar primary in Phase 4, payment primary in Phase 6 — no page rebuild needed |
| Claude only, no GPT-4o | Single AI vendor — simpler, cheaper, Claude handles vision + copy + scoring |
| Admin config UI pushed to Phase 9 | Only needed at 10+ clients — premature complexity in Phase 2-T |
| Cloudinary for photo uploads | Unsigned preset, client-side upload, secure_url sent to GHL — no backend needed |
| Single webhook per form type | Contact forms → ghlWebhookUrl (WF02). Photo form → ghlPhotoWebhookUrl (WF07) only. WF07 handles contact creation + welcome SMS + photo fields — no need to also fire WF02 for photo leads |

---

*This PRD is a living document. Update as the system evolves.*
*Last updated: 2026-04-04 | Version 2.2*
