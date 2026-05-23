// In-memory cache — survives scrolling, cleared on page refresh
const memoryCache = new Map();

export function getCachedImage(id) {
  return memoryCache.get(id) || null;
}

export function setCachedImage(id, src) {
  memoryCache.set(id, src);
}

export function isCached(id) {
  return memoryCache.has(id);
}

export function getCacheSize() {
  return memoryCache.size;
}

export function clearMemoryCache() {
  memoryCache.clear();
}