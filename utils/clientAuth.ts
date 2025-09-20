// utils/clientAuth.ts
export function saveToken(token: string) { localStorage.setItem("token", token); }
export function getToken() { return typeof window !== "undefined" ? localStorage.getItem("token") : null; }
export function clearToken() { localStorage.removeItem("token"); }
export function parseTokenPayload(token?: string) {
  try {
    const t = token ?? getToken();
    if (!t) return null;
    const payload = JSON.parse(atob(t.split(".")[1]));
    return payload;
  } catch { return null; }
}
