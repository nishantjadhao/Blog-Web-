export const TOKEN_KEY = "token";
export const USER_KEY = "user";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setSession = (token: string, user?: unknown) => {
  localStorage.setItem(TOKEN_KEY, token);

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const authHeaders = (): Record<string, string> => {
  const token = getToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(USER_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};
