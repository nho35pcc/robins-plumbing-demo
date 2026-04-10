// ============================================
// BUSINESS CONFIG — n8n edits ONLY this file
// ============================================

export const business = {
  // Core identity
  name: "DR Pressure",
  tagline: "The Power Washing Experts",
  subtagline: "Serving Eastern Massachusetts",
  description: "A local, veteran-owned washing company providing high-quality services for Eastern Massachusetts. Licensed, insured, and trusted by hundreds of homeowners.",
  phone: "(508) 250-3907",
  email: "drpressurepowerwashing@gmail.com",
  address: "35 Charles Street, Holliston, MA 01746",
  city: "Holliston",
  state: "MA",
  zip: "01746",

  // Branding
  primaryColor: "#182240",
  accentColor: "#F2CA52",

  // Logo — paste direct URL or leave empty for text logo
  logoUrl: "",

  // Hero image — main background photo
  heroImageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",

  // Hero v2 fields — all optional, have safe defaults
  heroLayout: "split",          // "split" | "stacked"
  heroHeadlineAccent: "The Power Washing", // phrase highlighted in accent color
  heroReviewRating: "4.9",      // shown as ★ in hero
  heroReviewCount: "200+",      // "Based on X reviews"
  heroReviewSource: "Google",   // platform name

  // Credential logos — renders section only if array has entries
  credentialLogos: [],          // [{ name: "GAF", imageUrl: "https://..." }]

  // Gallery images — 6 distinct photos (section 2.13 fix)
  galleryImages: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    "https://images.unsplash.com/photo-1558618047-3c8d19950e62?w=800&q=80",
  ],

  // Trust badges
  badges: [
    "Licensed & Insured",
    "Veteran-Owned",
    "Free Estimates",
    "20+ Years Experience",
  ],

  // Services — first 4 shown in homepage grid, all shown on /services page
  services: [
    {
      name: "Roof Cleaning",
      icon: "🏠",
      slug: "roof-cleaning",
      description: "Safe, thorough cleaning that removes moss, algae, and debris to extend the life of your roof.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    },
    {
      name: "House Washing",
      icon: "🪣",
      slug: "house-washing",
      description: "Restore your home's curb appeal with our gentle soft-wash system that removes dirt, mold, and stains.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    },
    {
      name: "Driveway Wash",
      icon: "🚗",
      slug: "driveway-wash",
      description: "High-pressure cleaning that removes oil stains, tire marks, and years of grime from concrete and pavers.",
      image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
    },
    {
      name: "Deck Wash",
      icon: "🌿",
      slug: "deck-wash",
      description: "Bring your deck back to life with professional cleaning that removes weathering, algae, and discoloration.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    },
    {
      name: "Gutter Cleaning",
      icon: "🌧️",
      slug: "gutter-cleaning",
      description: "Prevent water damage with thorough gutter cleaning and flushing to keep your drainage flowing.",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    },
    {
      name: "Pressure Washing",
      icon: "💧",
      slug: "pressure-washing",
      description: "Commercial-grade pressure washing for fences, patios, walkways, and more — fast and effective.",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    },
  ],

  // Process steps
  process: [
    { step: "1", title: "Contact Us", desc: "Call or fill out our form for a free quote." },
    { step: "2", title: "Free Estimate", desc: "We'll assess your property and provide a detailed quote." },
    { step: "3", title: "Schedule Job", desc: "Pick a time that works for you." },
    { step: "4", title: "We Do The Work", desc: "Our team arrives on time and gets the job done right." },
    { step: "5", title: "You're Amazed", desc: "Quality check, final walkthrough, and payment." },
  ],

  // Reviews
  reviews: [
    { name: "Denish M.", location: "Weston, MA", text: "Very nice, great customer service, amazing flexibility and very good job results." },
    { name: "Barbara T.", location: "Newton Center, MA", text: "Excellent service. Easy to work with. Does extra tasks without having to be asked." },
    { name: "Mark S.", location: "Chestnut Hill, MA", text: "Adam is personable and knowledgeable. He puts a lot of effort into getting the job done right." },
  ],

  // Service areas
  serviceAreas: [
    "Holliston", "Natick", "Weston", "Wayland", "Framingham",
    "Wellesley", "Medfield", "Dover", "Newton", "Waltham",
    "Needham", "Dedham", "Brookline", "Marlborough", "Ashland",
  ],

  // ============================================
  // GHL INTEGRATIONS
  // ============================================

  // Inbound webhook — all custom forms POST here (Workflow 02: contact creation + welcome SMS)
  ghlWebhookUrl: "https://services.leadconnectorhq.com/hooks/3RfcMWhxieVF840CC9bG/webhook-trigger/66b24783-73bd-4afe-a8e8-c726b5ef1bb2",

  // Photo-specific webhook — /photo page POSTs here in addition to ghlWebhookUrl (Workflow 07: photo intake)
  // Leave empty string until Workflow 07 inbound webhook is created in GHL
  ghlPhotoWebhookUrl: "https://services.leadconnectorhq.com/hooks/3RfcMWhxieVF840CC9bG/webhook-trigger/33b635d6-f5c7-43ad-a866-467f6839d724",

  // Legacy embed codes (contact page iframe)
  ghlFormEmbed: ``,

  // Chat widget (bottom right corner of every page)
  ghlChatEmbed: ``,

  // Calendar embed (for booking page or contact page)
  ghlCalendarEmbed: ``,

  // ============================================
  // GOOGLE MAPS API KEY
  // Get free key from console.cloud.google.com
  // Enable "Maps Embed API" — free up to 28k loads/month
  // One key works for ALL client sites
  // ============================================
  googleMapsApiKey: "AIzaSyAUwC6c6YuK0vNzJt4kURUrGaxd28FfvNI",

  // Social links (renders widget if array has entries)
  socialLinks: [
    { platform: "google", url: "https://g.page/drpressure", label: "Google" },
    { platform: "facebook", url: "https://facebook.com/drpressure", label: "Facebook" },
    { platform: "yelp", url: "https://yelp.com/biz/dr-pressure", label: "Yelp" },
  ],

  // Review gate
  googleReviewUrl: "",
  reviewPlatforms: [],

  // Hours
  hours: "Mon–Sun: 8:00 AM – 8:00 PM",
  emergency: true,

  // ============================================
  // PHOTO DIAGNOSIS PAGE
  // ============================================

  // Enables /photo.astro page and nav link
  photoPageEnabled: true,

  // Enables Path B (AI diagnosis) on photo page — requires anthropicApiKey
  aiDiagnosisEnabled: true,

  // GHL Workflow 7 follow-up mode: "auto" | "approval"
  followUpMode: "approval",

  // Anthropic API key for client-side Claude Vision calls on photo page
  // NOTE: This key is visible in page source. Use Vercel env var ANTHROPIC_API_KEY
  // at build time instead — set it in Vercel project settings for production.
  anthropicApiKey: "",

  // Cloudinary — used to upload photos from /photo page before sending URL to GHL
  // Get cloud name from cloudinary.com dashboard; create an unsigned upload preset
  // under Settings → Upload → Upload Presets
  cloudinaryCloudName: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  cloudinaryUploadPreset: import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
};
