/**
 * Attribution & Referral Engine
 * Captures query parameters: ref, src, utm_source, utm_medium, utm_campaign, utm_content
 * Preserves first-touch referral & source in sessionStorage.
 */

const STORAGE_KEYS = {
  REF: 'buildsquad_attr_ref',
  SRC: 'buildsquad_attr_src',
  UTM_SOURCE: 'buildsquad_attr_utm_source',
  UTM_MEDIUM: 'buildsquad_attr_utm_medium',
  UTM_CAMPAIGN: 'buildsquad_attr_utm_campaign',
  UTM_CONTENT: 'buildsquad_attr_utm_content',
  CAPTURED_AT: 'buildsquad_attr_captured_at',
};

export interface AttributionData {
  ref: string | null;
  src: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  resolvedChannel: 'ambassador' | 'community' | 'social_paid' | 'peer' | 'direct' | string;
}

/**
 * Normalizes email address consistently: lowercase, trimmed.
 */
export function normalizeEmail(email: string): string {
  return email ? email.trim().toLowerCase() : '';
}

/**
 * Resolve the final attribution channel based on assignment business rules:
 * - If referral code matches known ambassador -> 'ambassador'
 * - Otherwise if explicit source parameter exists -> maps to normalized channel
 * - Otherwise if referral code is present (unknown peer code) -> 'peer'
 * - Otherwise -> 'direct'
 */
export function resolveAttributionChannel(
  refCode: string | null,
  rawSource: string | null,
  knownAmbassadorCodes: string[]
): string {
  const cleanRef = refCode ? refCode.trim().toUpperCase() : null;

  // 1. Ambassador Match
  if (cleanRef) {
    const isAmbassador = knownAmbassadorCodes.some(
      (code) => code.toUpperCase() === cleanRef
    );
    if (isAmbassador) {
      return 'ambassador';
    }
  }

  // 2. Explicit Source Parameter
  if (rawSource && rawSource.trim()) {
    const s = rawSource.trim().toLowerCase();
    if (s.includes('community') || s.includes('whatsapp') || s.includes('discord') || s.includes('telegram') || s.includes('club')) {
      return 'community';
    }
    if (s.includes('paid') || s.includes('ad') || s.includes('social') || s.includes('linkedin') || s.includes('instagram') || s.includes('twitter')) {
      return 'social_paid';
    }
    return s;
  }

  // 3. Unrecognized Referral Code -> 'peer'
  if (cleanRef) {
    return 'peer';
  }

  // 4. Default -> 'direct'
  return 'direct';
}

/**
 * Parses query params from current URL or window.location,
 * saves first-touch attribution into sessionStorage,
 * and returns the active attribution data.
 */
export function captureAndGetAttribution(knownAmbassadorCodes: string[] = []): AttributionData {
  if (typeof window === 'undefined') {
    return {
      ref: null,
      src: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      resolvedChannel: 'direct',
    };
  }

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const urlRef = searchParams.get('ref') || searchParams.get('r');
    const urlSrc = searchParams.get('src') || searchParams.get('source');
    const urlUtmSource = searchParams.get('utm_source');
    const urlUtmMedium = searchParams.get('utm_medium');
    const urlUtmCampaign = searchParams.get('utm_campaign');
    const urlUtmContent = searchParams.get('utm_content');

    // First-touch persistence: Only set if not already present in sessionStorage
    if (urlRef && !sessionStorage.getItem(STORAGE_KEYS.REF)) {
      sessionStorage.setItem(STORAGE_KEYS.REF, urlRef.trim().toUpperCase());
    }
    if (urlSrc && !sessionStorage.getItem(STORAGE_KEYS.SRC)) {
      sessionStorage.setItem(STORAGE_KEYS.SRC, urlSrc.trim().toLowerCase());
    }
    if (urlUtmSource && !sessionStorage.getItem(STORAGE_KEYS.UTM_SOURCE)) {
      sessionStorage.setItem(STORAGE_KEYS.UTM_SOURCE, urlUtmSource.trim().toLowerCase());
    }
    if (urlUtmMedium && !sessionStorage.getItem(STORAGE_KEYS.UTM_MEDIUM)) {
      sessionStorage.setItem(STORAGE_KEYS.UTM_MEDIUM, urlUtmMedium.trim().toLowerCase());
    }
    if (urlUtmCampaign && !sessionStorage.getItem(STORAGE_KEYS.UTM_CAMPAIGN)) {
      sessionStorage.setItem(STORAGE_KEYS.UTM_CAMPAIGN, urlUtmCampaign.trim());
    }
    if (urlUtmContent && !sessionStorage.getItem(STORAGE_KEYS.UTM_CONTENT)) {
      sessionStorage.setItem(STORAGE_KEYS.UTM_CONTENT, urlUtmContent.trim());
    }
  } catch (e) {
    console.warn('Unable to access sessionStorage or URLSearchParams for attribution:', e);
  }

  const storedRef = sessionStorage.getItem(STORAGE_KEYS.REF) || null;
  const storedSrc = sessionStorage.getItem(STORAGE_KEYS.SRC) || null;
  const storedUtmSource = sessionStorage.getItem(STORAGE_KEYS.UTM_SOURCE) || null;
  const storedUtmMedium = sessionStorage.getItem(STORAGE_KEYS.UTM_MEDIUM) || null;
  const storedUtmCampaign = sessionStorage.getItem(STORAGE_KEYS.UTM_CAMPAIGN) || null;
  const storedUtmContent = sessionStorage.getItem(STORAGE_KEYS.UTM_CONTENT) || null;

  const rawSource = storedSrc || storedUtmSource || storedUtmMedium || null;
  const resolvedChannel = resolveAttributionChannel(storedRef, rawSource, knownAmbassadorCodes);

  return {
    ref: storedRef,
    src: storedSrc,
    utmSource: storedUtmSource,
    utmMedium: storedUtmMedium,
    utmCampaign: storedUtmCampaign,
    utmContent: storedUtmContent,
    resolvedChannel,
  };
}

