export const BASE_URL = import.meta.env.PUBLIC_BASE_URL ?? import.meta.env.BASE_URL ?? '/';

export const APP_VIP_CODE = import.meta.env.PUBLIC_APP_VIP_CODE || 'jmcode';
export const APP_NAME = import.meta.env.PUBLIC_APP_NAME || 'JMShop';
export const APP_DESC =
  import.meta.env.PUBLIC_APP_DESC ||
  'Tienda variada con los mejores productos al mejor precio.';
export const BANNER_TITLE =
  import.meta.env.PUBLIC_BANNER_TITLE || 'Descubre lo que necesitas';
export const BANNER_CONTENT =
  import.meta.env.PUBLIC_BANNER_CONTENT ||
  'Productos variados con la mejor calidad y precios accesibles. ¡Tu tienda de confianza te espera!';

export const WHATSAPP_NUMBER =
  import.meta.env.PUBLIC_WHATSAPP_NUMBER || '5356876678';
export const WHATSAPP_LINK = 'https://wa.me/' + WHATSAPP_NUMBER;

export const STORE_LOCATION =
  import.meta.env.PUBLIC_STORE_LOCATION || 'La Habana, Cuba';
export const STORE_HOURS =
  import.meta.env.PUBLIC_STORE_HOURS || 'Lunes a Domingo: 11am - 8pm';

/**
 *
 */
export const isBaseUrl = (path: string) => path.startsWith(BASE_URL);

/**
 * Return true if is a /vip url
 */
export const isVipUrl = (path: string) =>
  clearUrlBase(path).split('/')[1] === 'vip';

/**
 *
 */
export const resolveUrlBase = (path: string) => {
  if (!path.startsWith('/') || isBaseUrl(path)) return path;

  return BASE_URL.replace(/\/$/, '') + path;
};

/**
 * Resolve the url with BASE_URL and VIP url
 *
 * @param from Assign `Astro.url.pathname`
 * @param to - Target url to parse
 */
export const resolveUrlFrom = (from: string, to: string) => {
  let resolved = to;

  if (!to.startsWith('/')) return resolved;
  if (isBaseUrl(to)) resolved = clearUrlBase(resolved);
  if (isVipUrl(from)) resolved = '/vip/' + APP_VIP_CODE + resolved;

  return resolveUrlBase(resolved);
};

/**
 *
 */
export const clearUrlBase = (path: string) =>
  path.replace(new RegExp('^' + BASE_URL.replace(/\/$/, '')), '');

/**
 * Returns the list of allowed currencies from PUBLIC_ALLOWED_CURRENCIES.
 * Falls back to ['CUP'] if the variable is empty or not set.
 */
export function getAllowedCurrencies(): string[] {
  const raw = import.meta.env.PUBLIC_ALLOWED_CURRENCIES ?? '';
  const allowed = raw
    ? raw.split(',').map((c: string) => c.trim()).filter((c: string): boolean => c.length > 0)
    : ['CUP'];
  return allowed;
}

/**
 * Returns the default currency (first in the allowed list).
 */
export function getDefaultCurrency(): string {
  return getAllowedCurrencies()[0];
}

/**
 * Formats a price number as a localized currency string.
 * If currency is not provided, uses the default currency.
 */
export function formatPrice(price: number): string;
export function formatPrice(price: number, currency: string): string;
export function formatPrice(price: number, currency?: string): string {
  const cur = currency ?? getDefaultCurrency();
  const localeMap: Record<string, string> = {
    CUP: 'es-CU',
    USD: 'en-US',
    EUR: 'de-DE',
    // Add more as needed
  };
  const locale = localeMap[cur] ?? 'en-US';
  return price.toLocaleString(locale, { style: 'currency', currency: cur });
}

export function buildWhatsAppMessage(
  items: { name: string; price: number; quantity: number }[],
): string {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const lines = items.map(
    (item) =>
      `• ${item.name} x${item.quantity} — ${item.price.toLocaleString('es-CU')} CUP`,
  );
  const message = [
    '🛒 *Nuevo Pedido*',
    '',
    ...lines,
    '',
    `*Total: ${total.toLocaleString('es-CU')} CUP*`,
  ].join('\n');
  return message;
}

export function getWhatsAppUrl(
  items: { name: string; price: number; quantity: number }[],
): string {
  const message = buildWhatsAppMessage(items);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Returns the absolute URL for the current pathname.
 * Used for Open Graph og:url.
 * If PUBLIC_SITE is set, uses it as base; otherwise uses empty string (relative).
 */
export function getCanonicalUrl(pathname: string): string {
  const base = import.meta.env.PUBLIC_SITE ?? '';
  // Remove trailing slash from base and leading slash from pathname to avoid double slash
  return base.replace(/\/+$/, '') + pathname;
}