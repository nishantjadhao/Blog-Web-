import { authHeaders } from "./auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const apiImageUrl = (path: string) =>
  `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export const apiFetch = async (
  path: string,
  { auth = false, headers, ...init }: ApiOptions = {}
) => {
  const mergedHeaders = new Headers(headers || {});

  if (auth) {
    const tokenHeaders = authHeaders();

    Object.entries(tokenHeaders).forEach(([key, value]) => {
      mergedHeaders.set(key, value);
    });
  }

  return fetch(apiUrl(path), {
    ...init,
    headers: mergedHeaders,
  });
};
