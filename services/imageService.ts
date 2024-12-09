import { Image } from 'models/image';

/**
 * Builds an absolute URL for an Image path where preconfigured host name process.env.RUNTIME_IMAGE_SERVER_URL or process.env.RUNTIME_LITIUM_SERVER_URL is used.
 * @param image a Image.
 * @param baseUrl in case of calling from Client Components, a base Url should be provided.
 * The value can be retreived from WebsiteContext.
 * @returns an absolute image URL
 */
export function getAbsoluteImageUrl(
  image: Image | null,
  baseUrl?: string
): string {
  if (!image?.url) {
    return '';
  }
  const base =
    baseUrl ??
    (process.env.RUNTIME_IMAGE_SERVER_URL ||
      process.env.RUNTIME_LITIUM_SERVER_URL);
  if (!base) {
    return '';
  }
  return new URL(image.url, base).href;
}
