const GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions';
const MODEL = 'google/gemini-2.5-flash-lite';
const FALLBACK_MODEL = 'openai/gpt-4o-mini';

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQ = 18;
const rateBuckets = new Map();

const ALLOWED_FONTS = new Set(['cursive', 'modern', 'retro', 'bold']);
const ALLOWED_TYPES = new Set(['neon_mural', 'lampe_socle', 'tableau_lumineux']);
const ALLOWED_ICONS = new Set([
  'heart', 'star', 'crown', 'sparkle', 'coffee', 'car',
  'gamepad', 'moon', 'grad', 'book', 'bolt', 'flower', 'music', 'none'
]);
const ALLOWED_LAYOUTS = new Set(['centered', 'inline_icon', 'badge', 'framed']);

function getClientIp(request) {
  const fwd = request.headers.get('x-forwarded-for') || '';
  return fwd.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateBuckets.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateBuckets.set(ip, { start: now, count: 1 });
    if (rateBuckets.size > 500) {
      for (const [k, v] of rateBuckets.entries()) {
        if (now - v.start > RATE_WINDOW_MS) rateBuckets.delete(k);
      }
    }
    return true;
  }
  if (entry.count >= RATE_MAX_REQ) return false;
  entry.count += 1;
  return true;
}

function sanitizeHex(hex, fallback = '#ffe94a') {
  return /^#[0-9a-fA-F]{6}$/.test(String(hex || '').trim()) ? String(hex).trim() : fallback;
}

function cleanText(str, max = 140) {
  return String(str || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function buildFallbackDesign(rawPrompt) {
  const q = cleanText(rawPrompt, 240);
  const low = q.toLowerCase();

  let primaryColor = '#ffe94a';
  let primaryColorName = 'Jaune néon chaud';
  let secondaryColor = '#ff9f00';
  let secondaryColorName = 'Ambre doux';

  if (/\b(rose|pink|fushia|magenta)\b/.test(low)) {
    primaryColor = '#ff5fb8'; primaryColorName = 'Rose néon';
    secondaryColor = '#ffd6ec'; secondaryColorName = 'Blanc rosé';
  } else if (/\b(bleu|bleue|cyan|turquoise|azur)\b/.test(low)) {
    primaryColor = '#5ce8ff'; primaryColorName = 'Bleu glacier';
    secondaryColor = '#6f8cff'; secondaryColorName = 'Bleu électrique';
  } else if (/\b(violet|lilas|mauve|purple)\b/.test(low)) {
    primaryColor = '#b37bff'; primaryColorName = 'Violet néon';
    secondaryColor = '#ff5fb8'; secondaryColorName = 'Rose doux';
  } else if (/\b(rouge|red|sport|ferrari)\b/.test(low)) {
    primaryColor = '#ff4d5e'; primaryColorName = 'Rouge vif';
    secondaryColor = '#ffb45c'; secondaryColorName = 'Ambre chaud';
  } else if (/\b(vert|verte|menthe|emerald|green)\b/.test(low)) {
    primaryColor = '#5cffb0'; primaryColorName = 'Vert menthe';
    secondaryColor = '#5ce8ff'; secondaryColorName = 'Cyan doux';
  } else if (/\b(blanc|blanche|white|chaud|warm)\b/.test(low)) {
    primaryColor = '#fff2cc'; primaryColorName = 'Blanc chaud';
    secondaryColor = '#ffb45c'; secondaryColorName = 'Or doux';
  }

  let productType = 'neon_mural';
  let productTypeLabel = 'Néon LED mural sur acrylique';
  let dimensionsCm = '50 × 22 cm';
  let backingShape = 'Découpe contour acrylique transparent';

  if (/(?:^|[^a-zA-ZÀ-ÿ])(lampe|socle|bureau|chevet|dipl[oô]me|grav[eé]e?)(?![a-zA-ZÀ-ÿ])/.test(low)) {
    productType = 'lampe_socle';
    productTypeLabel = 'Lampe LED gravée sur socle';
    dimensionsCm = '22 × 18 cm';
    backingShape = 'Plaque acrylique gravée sur socle lumineux';
  } else if (/\b(tableau|cadre|poster|toile|affiche)\b/.test(low)) {
    productType = 'tableau_lumineux';
    productTypeLabel = 'Tableau lumineux rétroéclairé';
    dimensionsCm = '40 × 60 cm';
    backingShape = 'Cadre mural rétroéclairé haute luminosité';
  }

  let fontStyle = 'modern';
  if (/\b(cursif|cursive|calligraph|script|manuscrit|pr[eé]nom|amour|love)\b/.test(low)) {
    fontStyle = 'cursive';
  } else if (/(?:^|[^a-zA-ZÀ-ÿ])(r[eé]tro|vintage|80|disco|bar|caf[eé])(?![a-zA-ZÀ-ÿ])/.test(low)) {
    fontStyle = 'retro';
  } else if (/\b(gaming|sport|fort|bold|boutique|salon|logo)\b/.test(low)) {
    fontStyle = 'bold';
  }

  let icon = 'sparkle';
  if (/\b(c[oœ]ur|love|amour|mariage|couple)\b/.test(low)) icon = 'heart';
  else if (/\b(reine|roi|queen|king|couronne)\b/.test(low)) icon = 'crown';
  else if (/(?:^|[^a-zA-ZÀ-ÿ])(caf[eé]|coffee|th[eé]|tasse|barista)(?![a-zA-ZÀ-ÿ])/.test(low)) icon = 'coffee';
  else if (/\b(voiture|auto|sport|supra|bmw|moto)\b/.test(low)) icon = 'car';
  else if (/\b(game|gaming|manette|gamer|twitch|ps5|setup)\b/.test(low)) icon = 'gamepad';
  else if (/\b(lune|nuit|chambre|r[eê]ve|croissant)\b/.test(low)) icon = 'moon';
  else if (/\b(dipl[oô]me|bac|master|licence|graduation)\b/.test(low)) icon = 'grad';
  else if (/\b(coran|livre|verset|islam|ramadan)\b/.test(low)) icon = 'book';
  else if (/\b([eé]clair|bolt|energie|gym)\b/.test(low)) icon = 'bolt';
  else if (/\b(fleur|rose|tulipe)\b/.test(low)) icon = 'flower';
  else if (/\b(musique|note|studio|dj)\b/.test(low)) icon = 'music';
  else if (/\b([eé]toile|star)\b/.test(low)) icon = 'star';

  const quoted = q.match(/[«"]([^»"]{1,28})[»"]/);
  const named = q.match(/(?:pr[eé]nom|texte|mot|nom|écrit|ecrit)\s+([A-Za-zÀ-ÿ0-9'& -]{2,22})/i);
  let neonText = quoted ? quoted[1] : (named ? named[1].replace(/\b(en|pour|avec|sur)\b.*$/i, '').trim() : '');
  if (!neonText) {
    neonText = q
      .replace(/\b(un|une|des|le|la|les|et|ou|pour|avec|en|sur|de|du|mon|ma|lampe|n[eé]on|tableau|lumineux|enseigne|grav[eé]e?|cursif|cursive|chambre|salon|bureau|rose|bleu|bleue|glacier|jaune|rouge|violet|vert|verte|blanc|blanche|ambre|chaud|chaude|style|pro)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 3)
      .join(' ');
  }
  if (!neonText || neonText.length < 2) neonText = 'Perfect Room';
  if (neonText.length > 26) neonText = neonText.slice(0, 26).trim();

  const layout = productType === 'tableau_lumineux' ? 'framed' : (icon !== 'none' ? 'inline_icon' : 'centered');

  return {
    title: `Création « ${neonText} »`,
    neonText,
    subtitle: `${productTypeLabel} · ${primaryColorName}`,
    productType,
    productTypeLabel,
    fontStyle,
    primaryColor,
    primaryColorName,
    secondaryColor,
    secondaryColorName,
    glowIntensity: 'doux',
    icon,
    layout,
    dimensionsCm,
    backingShape,
    placementTip: productType === 'lampe_socle'
      ? 'Parfait sur une table de chevet, une étagère ou un bureau'
      : 'Idéal fixé au mur pour créer un point lumineux chaleureux',
    designNotes: `Proposition personnalisée en ${primaryColorName.toLowerCase()} sur ${backingShape.toLowerCase()}, pensée pour une ambiance douce et sans éblouissement.`,
    whatsappSummary: `Bonjour Perfect Room, je souhaite un devis pour ce design : ${productTypeLabel} « ${neonText} » (${primaryColorName}, env. ${dimensionsCm}, d'après : "${q}").`,
  };
}

function normalizeDesign(raw, originalPrompt) {
  const fb = buildFallbackDesign(originalPrompt);
  if (!raw || typeof raw !== 'object') return fb;
  const neonText = cleanText(raw.neonText || fb.neonText, 28) || fb.neonText;
  const productType = ALLOWED_TYPES.has(raw.productType) ? raw.productType : fb.productType;
  const fontStyle = ALLOWED_FONTS.has(raw.fontStyle) ? raw.fontStyle : fb.fontStyle;
  const icon = ALLOWED_ICONS.has(raw.icon) ? raw.icon : fb.icon;
  const layout = ALLOWED_LAYOUTS.has(raw.layout) ? raw.layout : fb.layout;
  const primaryColor = sanitizeHex(raw.primaryColor, fb.primaryColor);
  const secondaryColor = sanitizeHex(raw.secondaryColor, fb.secondaryColor);
  const productTypeLabel = cleanText(raw.productTypeLabel, 48) || fb.productTypeLabel;
  const primaryColorName = cleanText(raw.primaryColorName, 32) || fb.primaryColorName;
  const secondaryColorName = cleanText(raw.secondaryColorName, 32) || fb.secondaryColorName;
  const dimensionsCm = cleanText(raw.dimensionsCm, 28) || fb.dimensionsCm;
  const backingShape = cleanText(raw.backingShape, 64) || fb.backingShape;
  const placementTip = cleanText(raw.placementTip, 110) || fb.placementTip;
  const designNotes = cleanText(raw.designNotes, 220) || fb.designNotes;
  const title = cleanText(raw.title, 48) || `Création « ${neonText} »`;
  const subtitle = cleanText(raw.subtitle, 64) || `${productTypeLabel} · ${primaryColorName}`;
  const glowIntensity = raw.glowIntensity === 'intense' ? 'intense' : 'doux';
  const whatsappSummary = cleanText(
    raw.whatsappSummary || `Bonjour Perfect Room, je souhaite un devis pour ce design : ${productTypeLabel} « ${neonText} » (${primaryColorName}, style ${fontStyle}, env. ${dimensionsCm}).`,
    320
  );

  return {
    title,
    neonText,
    subtitle,
    productType,
    productTypeLabel,
    fontStyle,
    primaryColor,
    primaryColorName,
    secondaryColor,
    secondaryColorName,
    glowIntensity,
    icon,
    layout,
    dimensionsCm,
    backingShape,
    placementTip,
    designNotes,
    whatsappSummary,
  };
}

async function callGateway(prompt, token, model) {
  const systemPrompt = [
    'Tu es le designer lumière de Perfect Room, fabricant de luminaires artisanaux à Tlemcen (Algérie).',
    'Perfect Room fabrique : (1) des néons LED muraux sur acrylique transparent (neon_mural), (2) des lampes LED gravées sur socle lumineux (lampe_socle), et (3) des tableaux lumineux rétroéclairés (tableau_lumineux).',
    'À partir de la demande du client (en français ou darija/français), propose un design concret, esthétique et réalisable.',
    'RÈGLES STRICTES :',
    '- Réponds UNIQUEMENT par un objet JSON valide, sans markdown ni texte autour.',
    '- N\'invente JAMAIS de prix ni de délai de livraison.',
    '- "neonText" doit être court et percutant (1 à 26 caractères max, ex: "Sara", "Coffee Time", "Gaming Zone").',
    '- Choisis des couleurs néon lumineuses et harmonieuses en hex (#RRGGBB) adaptées à un mur sombre.',
    '- "fontStyle" parmi : "cursive" (prénoms, cadeaux, cozy), "modern" (épuré, chambre, salon), "retro" (café, bar, vintage), "bold" (gaming, sport, boutique).',
    '- "icon" parmi : "heart", "star", "crown", "sparkle", "coffee", "car", "gamepad", "moon", "grad", "book", "bolt", "flower", "music", "none".',
    '- "layout" parmi : "centered", "inline_icon", "badge", "framed".',
    '- "glowIntensity" parmi : "doux", "intense".',
    '- Tous les textes descriptifs doivent être en français naturel, chaleureux et professionnel.'
  ].join('\n');

  const userPrompt = `Demande client : "${prompt}"
Retourne exactement ce JSON :
{
  "title": "Titre court du projet",
  "neonText": "Texte affiché sur le néon (max 26 car.)",
  "subtitle": "Sous-titre court (type + ambiance)",
  "productType": "neon_mural | lampe_socle | tableau_lumineux",
  "productTypeLabel": "Nom clair du support en français",
  "fontStyle": "cursive | modern | retro | bold",
  "primaryColor": "#RRGGBB",
  "primaryColorName": "Nom couleur en français",
  "secondaryColor": "#RRGGBB",
  "secondaryColorName": "Nom couleur secondaire en français",
  "glowIntensity": "doux | intense",
  "icon": "heart | star | crown | sparkle | coffee | car | gamepad | moon | grad | book | bolt | flower | music | none",
  "layout": "centered | inline_icon | badge | framed",
  "dimensionsCm": "ex: 50 × 22 cm",
  "backingShape": "Description courte du support acrylique/cadre",
  "placementTip": "Conseil de placement en 1 phrase",
  "designNotes": "Description du rendu lumineux en 1 à 2 phrases, sans prix",
  "whatsappSummary": "Message court prêt à envoyer sur WhatsApp pour demander un devis sans prix inventé"
}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9500);
  try {
    const resp = await fetch(GATEWAY_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.65,
        max_tokens: 550,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    const text = await resp.text();
    if (!resp.ok) {
      return { ok: false, status: resp.status, detail: text.slice(0, 240) };
    }
    const data = JSON.parse(text);
    const content = data?.choices?.[0]?.message?.content || '';
    const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    return { ok: true, model: data?.model || model, parsed };
  } finally {
    clearTimeout(timer);
  }
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method === 'GET') {
      const token = request.headers.get('x-vercel-oidc-token') || process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
      if (url.searchParams.get('probe') === '1') {
        const sample = 'prénom Sara en rose cursif pour chambre';
        if (!token) {
          return Response.json({ ok: true, hasToken: false, source: 'fallback', design: buildFallbackDesign(sample) }, { headers });
        }
        try {
          let res = await callGateway(sample, token, MODEL);
          if (!res.ok) res = await callGateway(sample, token, FALLBACK_MODEL);
          if (res.ok) {
            return Response.json({ ok: true, hasToken: true, source: 'ai', model: res.model, design: normalizeDesign(res.parsed, sample) }, { headers });
          }
          return Response.json({ ok: true, hasToken: true, source: 'fallback', aiErrorStatus: res.status, aiErrorDetail: res.detail, design: buildFallbackDesign(sample) }, { headers });
        } catch (err) {
          return Response.json({ ok: true, hasToken: true, source: 'fallback', error: String(err?.message || err), design: buildFallbackDesign(sample) }, { headers });
        }
      }
      return Response.json({ ok: true, service: 'perfect-room-neon-ai', hasAuth: Boolean(token) }, { headers });
    }

    if (request.method !== 'POST') {
      return Response.json({ ok: false, error: 'Méthode non autorisée.' }, { status: 405, headers });
    }

    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return Response.json({ ok: false, error: 'Trop de demandes en peu de temps. Réessayez dans une minute.' }, { status: 429, headers });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ ok: false, error: 'Requête JSON invalide.' }, { status: 400, headers });
    }

    const prompt = cleanText(body?.prompt, 240);
    if (prompt.length < 2) {
      return Response.json({ ok: false, error: 'Décrivez votre néon en quelques mots (ex. : « Prénom Sara en rose cursif »).' }, { status: 400, headers });
    }

    const token = request.headers.get('x-vercel-oidc-token') || process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
    if (token) {
      try {
        let res = await callGateway(prompt, token, MODEL);
        if (!res.ok) {
          res = await callGateway(prompt, token, FALLBACK_MODEL);
        }
        if (res.ok) {
          return Response.json({
            ok: true,
            source: 'ai',
            model: res.model,
            design: normalizeDesign(res.parsed, prompt),
          }, { headers });
        }
      } catch {
        // Fallback below
      }
    }

    return Response.json({
      ok: true,
      source: 'fallback',
      design: buildFallbackDesign(prompt),
    }, { headers });
  },
};
