import { LemmyHttp } from "lemmy-js-client";
import { supportsWebp } from "../helpers/device";
import { omitUndefinedValues } from "../helpers/object";

function buildBaseUrl(url: string): string {
  return buildDirectConnectBaseUrl(url);
}

function buildDirectConnectBaseUrl(url: string): string {
  return `https://${url}`;
}

export function getClient(url: string, jwt?: string): LemmyHttp {
  return new LemmyHttp(buildBaseUrl(url), {
    // Capacitor http plugin is not compatible with cross-fetch.
    // Bind to globalThis or lemmy-js-client will bind incorrectly
    fetchFunction: fetch.bind(globalThis),
    headers: {
      Authorization: jwt ? `Bearer ${jwt}` : undefined,
      Cookie: jwt,
    } as {
      [key: string]: string;
    },
  });
}

export const LIMIT = 30;

interface ImageOptions {
  /**
   * maximum image dimension
   */
  size?: number;

  format?: "jpg" | "png" | "webp";
}

const defaultFormat = supportsWebp() ? "webp" : "jpg";

export function getImageSrc(url: string, options?: ImageOptions) {
  if (!options || !options.size) return url;

  const urlParams = options
    ? new URLSearchParams(
        omitUndefinedValues({
          thumbnail: options.size
            ? `${Math.round(options.size * window.devicePixelRatio)}`
            : undefined,
          format: options.format ?? defaultFormat,
        }),
      )
    : undefined;

  return `${url}${urlParams ? `?${urlParams}` : ""}`;
}
