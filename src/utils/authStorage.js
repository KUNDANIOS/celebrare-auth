const AUTH_KEY = "auth_user";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function saveUser(user) {
  const payload = {
    name: user.displayName,
    email: user.email,
    photo: user.photoURL ? user.photoURL.split('=')[0] + '=s96-c' : null,
    expiry: Date.now() + TTL_MS,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
}
export function loadUser() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  const data = JSON.parse(raw);
  if (Date.now() > data.expiry) {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
  return data;
}

export function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}