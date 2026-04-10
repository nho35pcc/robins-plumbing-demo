// Vercel serverless function — keeps Anthropic API key server-side only.
// Called by /photo page Path B (AI Diagnosis) instead of hitting Anthropic directly from the browser.
// Accepts multiple images: { images: Array<{ image: string, mimeType: string }> }
// Backward-compatible: if { image, mimeType } (singular) is passed, it is wrapped into array format.

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BASE64_LENGTH = 1_500_000; // ~1.1MB decoded — well above the 1024px JPEG the client sends
const MAX_IMAGES = 5;

interface ImageInput {
  image: string;
  mimeType: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body ?? {};

  // Normalize to array format — support both singular and multi-image payloads
  let images: ImageInput[];
  if (body.images && Array.isArray(body.images)) {
    images = body.images;
  } else if (body.image && typeof body.image === 'string') {
    // Backward-compatible single image
    images = [{ image: body.image, mimeType: body.mimeType }];
  } else {
    return res.status(400).json({ error: 'Missing images' });
  }

  // Validate array bounds
  if (images.length === 0 || images.length > MAX_IMAGES) {
    return res.status(400).json({ error: `images must contain 1–${MAX_IMAGES} items` });
  }

  // Validate each image
  for (let i = 0; i < images.length; i++) {
    const { image, mimeType } = images[i];
    if (!image || typeof image !== 'string' || image.length === 0) {
      return res.status(400).json({ error: `images[${i}]: missing image data` });
    }
    if (image.length > MAX_BASE64_LENGTH) {
      return res.status(400).json({ error: `images[${i}]: image too large` });
    }
    if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
      return res.status(400).json({ error: `images[${i}]: invalid image type` });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI diagnosis is not configured on this server.' });
  }

  try {
    // Build content array: all images first, then the text prompt
    const content: object[] = images.map(({ image, mimeType }) => ({
      type: 'image',
      source: { type: 'base64', media_type: mimeType, data: image }
    }));

    content.push({
      type: 'text',
      text: 'You are a home service expert. Analyze these photos and describe what repair work appears to be needed. Be thorough and specific about scope. End with a clear recommendation to have a professional assess in person. Do not minimize the work involved.'
    });

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content
        }]
      })
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.json().catch(() => ({}));
      const msg = (err as any)?.error?.message || `API error ${anthropicRes.status}`;
      return res.status(502).json({ error: msg });
    }

    const data = await anthropicRes.json();
    const diagnosis = data.content?.[0]?.text || 'Unable to generate diagnosis.';
    return res.status(200).json({ diagnosis });

  } catch (err: any) {
    return res.status(502).json({ error: 'Failed to reach AI service. Please try again.' });
  }
}
