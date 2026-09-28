export const FALLBACK_ASSET_URL = "/images/product-placeholder.svg";
export const LOVABLE_PUBLIC_ROOT = "https://promocoes-tkshop.lovable.app";
export const LOVABLE_PUBLIC_FALLBACK = `${LOVABLE_PUBLIC_ROOT}/api/public/media/uploads/1787698595803-59rx3b.webp`;

export function resolveAssetUrl(asset: { url?: string } | string | null | undefined, fallback = FALLBACK_ASSET_URL): string {
  const raw = typeof asset === "string" ? asset : asset?.url ?? fallback;

  if (!raw || raw.trim() === "") {
    return fallback;
  }

  if (raw.startsWith("/__l5e/")) {
    return LOVABLE_PUBLIC_FALLBACK;
  }

  if (raw.startsWith("/api/public/media/uploads/")) {
    return `${LOVABLE_PUBLIC_ROOT}${raw}`;
  }

  return raw;
}
