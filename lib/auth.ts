// lib/auth.ts

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null; // prevent SSR issues
  return localStorage.getItem("token");
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
};
