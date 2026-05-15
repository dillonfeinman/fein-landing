export const CONTACT_EMAIL = "dillonfeinman@gmail.com";

export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || "#request";

export const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim() || "";

export function isExternalUrl(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}
