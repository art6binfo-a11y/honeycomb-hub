import { createStart, createMiddleware } from "@tanstack/react-start";

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: blob: https:; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "connect-src 'self' https: wss:; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "object-src 'none'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
  "X-DNS-Prefetch-Control": "on",
};

const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  try {
    const response = (result as any)?.response as Response | undefined;
    if (response && response.headers) {
      for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
        if (!response.headers.has(k)) response.headers.set(k, v);
      }
    }
  } catch {
    // never break the request because of header hardening
  }
  return result;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeadersMiddleware],
}));