const cache = new Map();

export const setCache = (key, value, ttl = 60) => {
  cache.set(key, value);

  setTimeout(() => {
    cache.delete(key);
  }, ttl * 1000);
};

export const getCache = (key) => {
  return cache.get(key);
};
