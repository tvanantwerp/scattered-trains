/**
 * Turn any string into a 32-bit number, so a date like "2026-10-05" can seed
 * the random generator and always produce the same forecast.
 */
export function hashString(text) {
  let h = 1779033703 ^ text.length
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507)
  h = Math.imul(h ^ (h >>> 13), 3266489909)
  return (h ^= h >>> 16) >>> 0
}

/**
 * A small seeded random number generator (mulberry32) with a few helpers.
 * The same seed always gives the same sequence.
 */
export function createRandom(seed) {
  let state = typeof seed === 'string' ? hashString(seed) : seed >>> 0

  function next() {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  return {
    next,
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1))
    },
    pick(list) {
      return list[Math.floor(next() * list.length)]
    },
    chance(probability) {
      return next() < probability
    },
    /** Pick `count` different items from a list. */
    sample(list, count) {
      const pool = [...list]
      const picked = []
      while (picked.length < count && pool.length) {
        picked.push(pool.splice(Math.floor(next() * pool.length), 1)[0])
      }
      return picked
    },
  }
}
