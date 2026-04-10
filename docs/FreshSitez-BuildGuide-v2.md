# FreshSitez Build Guide v2
**MayWenti LLC / Norman Ho | Updated 2026-03-29**

---

## CURRENT STATUS
**Phase:** 2-T (template upgrades) + Phase 3 (Stripe) running in parallel
**Next build task:** n8n Flow 1 — lead scraper (waiting on Norman review of docs)
**Blocked on:** Google Maps API key, n8n Cloud login, GitHub token, Vercel token

---

## SESSION LOG

| Date | What was built | Notes |
|------|---------------|-------|
| 2026-03-24 | Initial PRD + BuildGuide v2 created | Baseline docs |
| 2026-03-29 | Hamburger nav, mobile responsive fixes (all pages) | All pages done |
| 2026-03-29 | Quote modal popup | Working on all CTA buttons |
| 2026-03-29 | /photo.astro — dual-path photo diagnosis | Cloudinary upload added |
| 2026-03-29 | /review.astro — review gate page | Built |
| 2026-03-29 | /services/[slug].astro — dynamic service detail pages | Built |
| 2026-03-29 | Services page mobile stack fix | Image on top, content below |
| 2026-03-29 | Contact page mobile order fix | Form above info on mobile |
| 2026-03-29 | About page stats grid mobile fix | 2x2 on mobile |
| 2026-03-29 | Cloudinary photo upload on /photo page | Uploads before GHL POST |
| 2026-03-29 | BuildGuide + PRD updated | Reflecting current state |
| 2026-04-01 | Multi-photo upload on /photo page | Up to 5 photos, parallel Cloudinary uploads, + Add more button |
| 2026-04-01 | Cloudinary creds moved to Vercel env vars | CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET |
| 2026-04-04 | Single webhook per form type | Photo form → ghlPhotoWebhookUrl (WF07) only; contact forms → ghlWebhookUrl (WF02) only |

---

## ✅ COMPLETED — Template (Phase 2-T)

- [x] All 8 pages built: index, services, services/[slug], gallery, about, contact, review, photo
- [x] business.config.js fully stubbed with expanded schema
- [x] Hamburger nav on all pages (mobile)
- [x] Mobile responsive — all pages (375px tested via Playwright)
- [x] Quote popup modal on all CTA buttons
- [x] Social links widget on homepage about section
- [x] /review.astro — review gate (4-5 stars → GMB, 1-3 → internal form)
- [x] /services/[slug].astro — dynamic detail pages with FAQ accordion
- [x] /photo.astro — dual-path: send to contractor OR AI diagnosis
- [x] Cloudinary photo upload before GHL webhook POST
- [x] photoUrl + photoLeadSource fields in GHL payload
- [x] GHL chat widget via is:inline in Layout.astro
- [x] Contact/homepage/review forms POST to ghlWebhookUrl (WF02) only
- [x] Photo form POSTs to ghlPhotoWebhookUrl (WF07) only — WF07 handles contact creation + welcome SMS + photo fields
- [x] Multi-photo upload (up to 5), parallel Cloudinary uploads, + Add more button
- [x] Vercel auto-deploy on push to main
- [x] GitHub repo: nho3pcc/contractor-template

---

## ✅ COMPLETED — Infrastructure

- [x] GHL FreshSitez sub-account active (TapIQ, Glendale CA)
- [x] GHL phone number purchased (LA area code)
- [x] Pipeline built (New Lead → Won)
- [x] Custom fields built (Lead Source, Service Requested, Property Address, Job Value Estimate, Notes)
- [x] 6 workflows published (Missed Call Text Back, New Lead Welcome, Follow-up D1, D3, Review Request, Appointment Reminder)
- [x] Chat widget built (widget ID: 69bf835e65af0bbb882e9b2f)
- [x] Calendar built (Service Booking, "Free Estimate", 30 min)
- [x] A2P SMS registration submitted
- [x] freshsitez.com live on Vercel (Cloudflare DNS)
- [x] hello@freshsitez.com on Google Workspace with DKIM
- [x] Privacy policy + terms live on freshsitez.com
- [x] Claude Code set up in WSL Ubuntu

---

## ⏳ REMAINING — Phase 1 Finish Line

- [ ] GHL snapshot — **"FreshSitez Master v2"** (updated from v1 — photo URL fix included)
      → Agency View → Snapshots → + Create Snapshot
- [ ] Stripe account + $297/month recurring payment link
      → stripe.com → Products → New → $297/month → Payment Link
- [ ] Google Maps API key → paste into business.config.js → googleMapsApiKey
      → console.cloud.google.com → Enable Maps Embed API → Create key
- [ ] Test full flow end to end:
      form submit → GHL contact created → SMS fires within 60 sec
      missed call → text back within 2 min
      photo page submit → Cloudinary URL in GHL contact record
- [ ] Workflow 7: Photo Intake + Follow-up with Approval Mode
      → Add followUpMode custom field (dropdown: auto / approval)
      → Branch: auto = send follow-up at 48hr automatically
      → Branch: approval = text contractor first, wait YES/NO reply

---

## ⏳ REMAINING — Phase 2 (Parallel with manual outreach)

- [ ] Stripe payment link live and tested
- [ ] Calendar link set up (Calendly or GHL calendar)
- [ ] Pitchlane account + first video recorded
- [ ] Pitchlane page template built (see Phase 4 below)

---

## IMPORTANT TECHNICAL NOTES

### Astro Script Stripping
Astro strips `<script>` from `set:html`. Solutions in use:
- Chat widget → `is:inline` in Layout.astro
- Calendar → `<iframe is:raw>` + `<script is:inline src="...">` adjacent
- **NEVER** use `<Fragment set:html={...}>` for anything containing `<script>`

### business.config.js is Sacred
The ONLY file n8n edits per client. Every feature must be configurable from here.
Never hardcode anything that varies per client.

### Forms → GHL
All forms use custom-styled HTML + `fetch()` POST to GHL inbound webhooks.
No GHL iframe embeds for forms. Reasons: no Astro stripping issues, custom styling, no CORS problems.

**Contact / homepage / review forms:** POST to `ghlWebhookUrl` (Workflow 02: contact creation + welcome SMS).

**Photo form (`/photo.astro`):** POSTs to `ghlPhotoWebhookUrl` only (Workflow 07: contact creation + photo field mapping + welcome SMS + contractor notification). WF07 handles everything for photo leads — WF02 is not involved.

### Photo Upload Flow
/photo page: image resized client-side to 1024px JPEG → uploaded to Cloudinary
(unsigned preset) → secure_url included in GHL webhook POST as `photoUrl`.
Falls back silently if Cloudinary not configured — lead still submitted.

---

## PHASE 3 — STRIPE

1. Create Stripe account at stripe.com
2. Products → + New: "FreshSitez Website + GHL Automations" → $297/month recurring
3. Generate Payment Link → copy URL
4. Settings → Integrations → Stripe in GHL → connect
5. Test payment → confirm GHL contact tagged "paying-client"

**Do this NOW — you need this before first client, not after template polish.**

---

## PHASE 4 — FIRST CLIENTS MANUALLY

*Goal: 5-10 paying clients before automating outreach. Learn objections.*

### Norman's parallel track (while system is being built)
- Identify 10-20 target businesses manually (Google Maps, Tier 1 niches)
- Shoot one Pitchlane video per niche (generic, works for multiple prospects)
- Set up calendar link — GHL calendar or Calendly
- Send manual outreach emails to 5-10 prospects per week
- Take sales calls, document every objection and "wow" moment

### Qualification checklist
- GMB with 20+ reviews ✓
- Bad website OR no website ✓
- Owner-operated ✓
- Phone is primary contact ✓
- Already spending on leads (Angi, Thumbtack) ✓

### Build their preview site (manual for now)
1. Duplicate contractor-template repo on GitHub
2. Update business.config.js with their info
3. Push → Vercel deploys → copy preview URL
4. Screenshot for Pitchlane video

### Outreach sequence — CALENDAR FIRST

**Day 1 — Pitchlane video email:**
```
Subject: Built you something, [First Name]

Hey [First Name],

I run a service called FreshSitez — we build done-for-you websites
for [niche] businesses.

I liked what I saw about [Business Name] so I went ahead and built
a site for you: [VERCEL_PREVIEW_URL]

Takes 10 minutes to go live on your domain. Here's a 2-minute
video showing exactly what's included: [PITCHLANE_URL]

Want to jump on a quick call?
[CALENDAR_LINK]

Or if you're ready to go: [STRIPE_PAYMENT_LINK]

— Norman
```

**Day 3 — Plain text follow-up:**
```
Hey [Name], did you get a chance to check out the site I built?
Happy to walk you through it on a quick call: [CALENDAR_LINK]
```

**Day 7 — SMS from GHL:**
```
Hi [Name], sent you an email about a free website preview for
[Business]. Worth 60 seconds — [PITCHLANE_URL]
```

**Note:** Calendar CTA is primary in Phase 4. Payment link is secondary.
Flip the emphasis to payment link primary once you've done 10+ calls
and know the objections.

### Pitchlane video page — must include
- Norman's video (Loom or Pitchlane)
- Preview of their Vercel demo site (iframe or link)
- Their business name personalized in headline
- **Button 1 (primary): "Book a 15-min call"** → calendar link
- **Button 2 (secondary): "Get started — $297/mo"** → Stripe payment link

Both buttons present from day one. Emphasis switches in Phase 6.

### When they say yes (manual onboarding)
1. Send Stripe payment link
2. Confirm payment received
3. GHL: manually clone FreshSitez Master v2 snapshot to new sub-account
4. Get new sub-account's inbound webhook URL → paste into `ghlWebhookUrl`
5. If client has Workflow 07 (photo intake), get that inbound webhook URL → paste into `ghlPhotoWebhookUrl`. Otherwise leave as `""`
6. Update business.config.js with real GHL data + Cloudinary creds if needed
6. Push → site redeploys with real GHL connected
7. Send DNS setup instructions (see Phase 7 onboarding)
8. Send welcome email: LeadConnector app download + login + "here's what happens when a lead comes in"

**Promise: site live on their domain within the hour of payment.**

---

## PHASE 5 — AUTOMATE SITE CREATION (n8n)

*Build after first 1-3 paying clients. Don't automate before validating.*

### Credentials needed from Norman
| Credential | Where to get | Used in |
|------------|-------------|---------|
| Google Maps API key | console.cloud.google.com | Flow 1 |
| n8n Cloud login | app.n8n.cloud | All flows |
| GitHub personal access token | github.com/settings/tokens | Flow 3 |
| Vercel API token | vercel.com/account/tokens | Flow 3 |
| Vercel team/project ID | Vercel dashboard | Flow 3 |
| WHOIS API key | whoisjsonapi.com (free tier) | Flow 1 |
| Anthropic API key | Already in WSL ~/.bashrc | Flow 2 |

### Airtable Base: FreshSitez Pipeline

**Prospects table columns:**
name | phone | address | website | registrar | city | niche | date_added | prospect_score | status | preview_url | github_repo | outreach_sent_date | reply | notes

**status values:** new → researched → deployed → review_queue → outreach_sent → call_booked → paying → dead

### n8n Flow 1 — Prospector
```
Trigger: Schedule (nightly 11pm) OR manual
→ Set: niche="pressure washing", city="Glendale CA", radius=30mi
→ HTTP: GET maps.googleapis.com/maps/api/place/textsearch/json
  params: query="{niche} {city}", key={GOOGLE_MAPS_API_KEY}
→ Loop over results (up to 60)
→ HTTP: GET place details (website, phone, address, name, rating, reviews)
→ Filter: no website OR website is Wix/GoDaddy/Squarespace
→ HTTP: GET whoisjsonapi.com/v1/{domain} → capture registrar
→ Claude API: score prospect 1-10 on need for new site (see scoring prompt below)
→ Filter: score >= 6
→ Append to Airtable Prospects table
→ Update status: "new"
```

**Prospect scoring prompt:**
```
Rate this contractor prospect 1-10 for likelihood they need a new website.
Score 8-10: no website or clearly Wix/GoDaddy placeholder
Score 6-7: outdated website, low PageSpeed, poor mobile
Score 1-5: decent modern website
Business: {name}, Website: {website_url}, Reviews: {review_count}
Return JSON only: {"score": 7, "reason": "GoDaddy site from 2018"}
```

### n8n Flow 2 — Claude Personalization Agent
```
Trigger: New row in Airtable (status = "new") OR manual
→ Read Airtable row
→ HTTP: GET their website → capture HTML (if website exists)
→ HTTP: POST Anthropic API
  model: claude-opus-4-6
  prompt: see PERSONALIZATION PROMPT below
→ Parse JSON response
→ Validate required fields (name, phone, city, services array)
→ Write config JSON to Airtable row
→ Update status: "researched"
→ Trigger Flow 3
```

**PERSONALIZATION PROMPT** (paste into n8n HTTP node body):
```
You are helping build a contractor website. Extract details from this
business and output a valid JSON object. If you cannot find a value,
use a sensible default. Output ONLY valid JSON, no other text.

Business name: {{name}}
Website URL: {{website}}
Website HTML (first 5000 chars): {{html}}

Required JSON schema:
{
  "name": "exact business name",
  "tagline": "short punchy tagline (invent if needed)",
  "subtagline": "city + state they serve",
  "description": "2-3 sentences about the business",
  "phone": "their phone number",
  "email": "their email or info@domain.com",
  "address": "full street address",
  "city": "primary city",
  "state": "2-letter state",
  "zip": "zip code",
  "heroImageUrl": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
  "badges": ["up to 4 trust badges matching their claims"],
  "services": [
    {
      "name": "Service Name",
      "icon": "emoji",
      "slug": "service-name",
      "description": "1-2 sentence description",
      "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    }
  ],
  "serviceAreas": ["list of cities they serve"],
  "hours": "their hours or Mon-Fri: 8AM-6PM",
  "emergency": false,
  "primaryColor": "#182240",
  "accentColor": "#F2CA52",
  "ghlWebhookUrl": "",
  "ghlPhotoWebhookUrl": "",
  "ghlChatWidgetId": "",
  "ghlCalendarEmbed": "",
  "googleMapsApiKey": "",
  "cloudinaryCloudName": "",
  "cloudinaryUploadPreset": "",
  "photoPageEnabled": false,
  "aiDiagnosisEnabled": false,
  "followUpMode": "approval",
  "googleReviewUrl": "",
  "reviewPlatforms": [],
  "socialLinks": [],
  "galleryImages": [],
  "anthropicApiKey": "",
  "logoUrl": "",
  "process": [
    {"step":"1","title":"Contact Us","desc":"Call or fill out our form for a free quote."},
    {"step":"2","title":"Free Estimate","desc":"We assess your property and provide a detailed quote."},
    {"step":"3","title":"Schedule","desc":"Pick a time that works for you."},
    {"step":"4","title":"We Do The Work","desc":"Our team arrives on time and gets the job done right."},
    {"step":"5","title":"You're Amazed","desc":"Quality check, final walkthrough, and payment."}
  ],
  "reviews": [
    {"name":"Happy Customer","location":"Local Area","text":"Great service, highly recommend!"}
  ]
}
```

### n8n Flow 3 — GitHub Clone + Vercel Deploy
```
Trigger: Airtable status = "researched" OR manual
→ Read config JSON from Airtable
→ Convert JSON to business.config.js file content (JS module format)
→ HTTP: POST github.com/api/v3/repos/nho35pcc/contractor-template/forks
  headers: Authorization: Bearer {GITHUB_TOKEN}
  body: { name: "{slug}-freshsitez" }
→ Wait 15 seconds for fork to initialize
→ HTTP: GET new repo's business.config.js to get current SHA
→ HTTP: PUT new repo's business.config.js
  body: { message: "Configure for {name}", content: base64(config_content), sha: {sha} }
→ HTTP: POST api.vercel.com/v13/deployments
  headers: Authorization: Bearer {VERCEL_TOKEN}
  body: { name: "{slug}-freshsitez", gitSource: { type: "github", repoId, ref: "main" } }
→ Poll deployment status every 15s until ready (max 5 min)
→ Capture: deploymentUrl (e.g. slug-freshsitez.vercel.app)
→ HTTP: POST api.vercel.com/v9/projects/{projectId}/domains
  body: { name: "{their_domain}" }  ← pre-register for when DNS points here
→ Write to Airtable: preview_url, github_repo, deploy_date
→ Update status: "deployed"
→ Trigger Flow 4
```

**business.config.js file content format:**
```javascript
// ============================================
// BUSINESS CONFIG — n8n edits ONLY this file
// ============================================

export const business = {
  // paste all JSON fields converted to JS object syntax here
};
```

### n8n Flow 4 — Quality Check
```
Trigger: After Flow 3 OR manual
→ Wait 30 seconds for Vercel deploy to stabilize
→ HTTP: GET preview URL → confirm 200 response
→ Claude API: given the business config, score the site setup 1-10
  (does it have real phone, real services, real city — or placeholders?)
→ Score >= 7 → update status "outreach_ready" → trigger Flow 5
→ Score < 7 → update status "review_queue" → Slack/email Norman to review
```

*Note: Using Claude for quality scoring, not GPT-4o — one AI vendor, simpler.*

### n8n Flow 5 — Outreach Builder
```
Trigger: status = "outreach_ready" OR manual
→ Claude API: generate personalized email copy + 3 subject line variants
→ HUMAN APPROVAL GATE: n8n waits for Norman to approve via webhook
  (send Slack message or email with approve/reject buttons)
  ← REMOVE THIS STEP in Phase 6 once quality is proven
→ GHL API: create contact in FreshSitez sub-account, tag "prospect"
→ GHL API: enroll in outreach sequence (or use Instantly — TBD)
→ Write to Airtable: outreach_sent_date
→ Update status: "outreach_sent"
```

---

## PHASE 6 — AUTOMATE OUTREACH

### Email Infrastructure
1. Buy 10 cold email domains (~$1 each at Namecheap)
   - Pattern: freshsitez-{word}.com — NEVER use main domain for cold email
2. Add to Instantly → run Mailreach warmup 2-3 weeks minimum
3. Sending limit: 30/day/account to start, scale to 50 after 4 weeks

### Outreach Sequence in Instantly
- Day 1: Pitchlane video email (calendar CTA primary)
- Day 3: Plain text follow-up
- Day 14: Social proof angle ("3 [niche] businesses in [city] just launched...")
- Day 30: Breakup email
- Stop on reply: YES (critical)

### GHL SMS Sequence
- Day 5: Short text + Pitchlane URL
- Day 10: Second touch

### Reply Handling (Claude classifier in GHL workflow)
Classify intent → route:
- INTERESTED → send calendar link + payment link
- QUESTION → Claude generates response, flag for Norman review
- NOT INTERESTED → unsubscribe, log reason in Airtable
- OUT OF OFFICE → pause 5 days, resume

**Any reply in any channel pauses ALL sequences for that contact immediately.**

### Switching from calendar-first to payment-first
When you've done 10+ calls and can predict the conversation:
- Update Pitchlane page: make payment link the primary button
- Update outreach copy: lead with the site + payment link, calendar as fallback
- No other changes needed — infrastructure stays identical

---

## PHASE 7 — AUTOMATE ONBOARDING

### Post-Payment DNS Setup Page

Triggered within 60 seconds of Stripe payment. Client receives email with link to personalized page containing:

- Their Vercel preview URL (working immediately — show this prominently)
- Exact DNS records pre-filled with their domain:
  ```
  Type: A    | Name: @   | Value: 76.76.21.21
  Type: CNAME | Name: www | Value: cname.vercel-dns.com
  ```
- Registrar-specific screenshot guides (detect from WHOIS during prospecting)
- "Your site will be live within 20 minutes of completing these steps"
- Support link (GHL chat or calendar)

**Registrar guides to build** (covers ~90% of small businesses):
GoDaddy | Namecheap | Google Domains | Squarespace |
Bluehost | Cloudflare | Network Solutions | Hover

**Wording on timing:**
> "Most domains go live within 20 minutes. Worst case, up to 24 hours
> depending on your registrar — but your site is built and ready right now."

### Full Onboarding n8n Flow
```
Trigger: Stripe webhook → checkout.session.completed
→ Extract: customer name, email, domain from Stripe metadata
→ Look up prospect in Airtable by email
→ GHL API: clone FreshSitez Master v2 snapshot → new sub-account
→ Wait 30 seconds
→ GHL API: get new sub-account inbound webhook URL
→ GitHub API: update client's business.config.js with real GHL webhook URL
→ GitHub push → Vercel redeploys (~60 seconds)
→ GHL API: pre-register their domain on Vercel project
→ Send onboarding email: DNS setup page URL + LeadConnector app download
→ Schedule follow-up: 2 hours later — check if domain resolves
→ Airtable: update status to "paying", move to Clients table
→ Remove contact from all outreach sequences immediately
```

**Target: Payment → personalized DNS page in under 60 seconds.**

---

## PHASE 8 — FRESHSITEZ.COM MARKETING SITE

*Build after 3-5 paying clients. Need testimonials + pricing confidence.*

Pages:
- Home — hero, how it works, demo preview, pricing, testimonials, CTA
- /pricing — what's included, $297/month, FAQs
- /demo — links to live client sites or demo
- /contact or calendar embed

**Lead with the speed promise:** "Your site goes live today. Not next week. Today."

---

## PHASE 9 — CUSTOMER SELF-SERVICE PORTAL

*Build at 10-20+ clients when managing configs manually becomes painful.*

- Magic link auth (email-based, no passwords)
- Editable fields: name, phone, hours, photos, services, service areas
- Domain connection flow with registrar detection
- n8n webhook → GitHub → Vercel auto-redeploy on save

---

## KEY API ENDPOINTS

### GHL Agency API
```
Base: https://services.leadconnectorhq.com
Auth: Authorization: Bearer {GHL_API_KEY}

Create sub-account from snapshot:
POST /locations/
{ "name": "...", "phone": "...", "email": "...", "snapshotId": "...", "companyId": "..." }

Create contact:
POST /contacts/
{ "locationId": "...", "firstName": "...", "phone": "...", "tags": ["prospect"] }
```

### GitHub API
```
Get file:
GET /repos/nho35pcc/{repo}/contents/src/business.config.js
Authorization: token {GITHUB_TOKEN}

Update file:
PUT /repos/nho35pcc/{repo}/contents/src/business.config.js
{ "message": "Configure for {name}", "content": "{base64}", "sha": "{sha}" }
```

### Vercel API
```
Create deployment:
POST /v13/deployments
Authorization: Bearer {VERCEL_TOKEN}
{ "name": "{slug}", "gitSource": { "type": "github", "repoId": "...", "ref": "main" } }

Pre-register domain:
POST /v9/projects/{projectId}/domains
{ "name": "{domain}" }
```

### Anthropic API (n8n HTTP node)
```
POST https://api.anthropic.com/v1/messages
x-api-key: {ANTHROPIC_API_KEY}
anthropic-version: 2023-06-01
{
  "model": "claude-opus-4-6",
  "max_tokens": 2048,
  "messages": [{ "role": "user", "content": "{prompt}" }]
}
```

### Google Places API
```
GET https://maps.googleapis.com/maps/api/place/textsearch/json
?query={niche}+{city}&key={GOOGLE_MAPS_API_KEY}
```

---

## MONTHLY COST TRACKER

| Tool | Cost | Start when |
|------|------|-----------|
| GHL Agency | $297 | NOW ✅ |
| Claude Max | $100 | NOW ✅ |
| n8n Cloud | $20 | Phase 5 |
| Vercel Pro | $20 | When >3 sites |
| Instantly | $37 | Phase 6 |
| Pitchlane | $37-67 | Phase 4 |
| Ideogram API | $20-50 | Phase 5 (logo gen) |
| Claude/Anthropic API | $30-50 | Phase 5 |
| Cold email domains (10) | $10 | Phase 6 |
| **Total at full operation** | **~$620-750/mo** | |

**Break-even: 3 clients ($891 MRR covers everything)**

---

## REVENUE MILESTONES

| Clients | MRR | Target timeline |
|---------|-----|----------------|
| 1 | $297 | Week 3-4 |
| 3 | $891 | Month 2 |
| 10 | $2,970 | Month 2-3 |
| 50 | $14,850 | Month 4-5 |
| 100 | $29,700 | Month 6-8 |

---

*Last updated: 2026-04-04 | FreshSitez Build Guide v2.2*
