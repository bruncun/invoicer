import * as cookie from "cookie";
import { TOKEN_KEY } from "~/constants/constants";

function decodePayload(token: string): { exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")));
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request) {
  return cookie.parse(request.headers.get("Cookie") ?? "")[TOKEN_KEY];
}

export function isTokenExpired(token: string | undefined, now = Date.now()) {
  const exp = token ? decodePayload(token)?.exp : undefined;
  return !exp || exp * 1000 <= now;
}

export function clearAuthCookieHeaders() {
  return {
    "Set-Cookie": cookie.serialize(TOKEN_KEY, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }),
  };
}

export { TOKEN_KEY };
