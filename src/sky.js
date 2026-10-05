import { createRandom } from './random.js'

const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
const SPRITE_SIZE = 96
const spriteCache = new Map()

/**
 * Draw a glyph as a flat one-color silhouette. Emoji look different on every
 * device, so flattening them into a single ink color makes them read as part
 * of the illustration instead of as stickers.
 */
export function silhouette(glyph, color) {
  const key = `${glyph}|${color}`
  if (spriteCache.has(key)) return spriteCache.get(key)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SPRITE_SIZE
  const ctx = canvas.getContext('2d')
  ctx.font = `${SPRITE_SIZE * 0.78}px ${EMOJI_FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(glyph, SPRITE_SIZE / 2, SPRITE_SIZE * 0.54)
  ctx.globalCompositeOperation = 'source-in'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE)
  spriteCache.set(key, canvas)
  return canvas
}

/** Speeds in pixels per second, before depth and size adjustments. */
const MOTIONS = {
  fall: { vx: [-6, 6], vy: [45, 95], sway: 6, spin: 0.25 },
  flutter: { vx: [-10, 10], vy: [14, 34], sway: 34, spin: 0 },
  drift: { vx: [-70, -22], vy: [0, 0], sway: 5, spin: 0 },
  rise: { vx: [-6, 6], vy: [-42, -16], sway: 10, spin: 0.1 },
}

/**
 * Animate a forecast's sky on a canvas: gradient, slow clouds, the night's
 * precipitation, and a row of rooftops along the bottom.
 */
export function createSky(canvas) {
  const ctx = canvas.getContext('2d')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let forecast = null
  let particles = []
  let clouds = []
  let roofs = []
  let width = 0
  let height = 0
  let frame = 0
  let last = 0
  let elapsed = 0
  const grain = makeGrain()

  function resize() {
    const rect = canvas.getBoundingClientRect()
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    if (forecast) populate()
    draw(0)
  }

  function populate() {
    const r = createRandom(`sky:${forecast.seed}`)
    const { precip, qualifier, density } = forecast
    const speedFactor = qualifier.word === 'Freezing' ? 0.35 : qualifier.word === 'Heavy' ? 1.35 : 1
    const motion = MOTIONS[precip.motion]
    const base = (width * height) / (5200 * precip.size * precip.size)
    const count = Math.round(Math.max(1, Math.min(140, base * density)))

    particles = Array.from({ length: count }, () => {
      const depth = 0.45 + r.next() * 0.55
      return {
        x: r.next() * width,
        y: precip.motion === 'drift' ? height * (0.08 + r.next() * 0.62) : r.next() * height,
        depth,
        size: 26 * precip.size * depth,
        vx: lerp(motion.vx, r.next()) * depth * speedFactor,
        vy: lerp(motion.vy, r.next()) * depth * speedFactor,
        phase: r.next() * Math.PI * 2,
        rotation: (r.next() - 0.5) * 0.6,
        spin: (r.next() - 0.5) * motion.spin,
      }
    })

    clouds = Array.from({ length: 5 }, () => ({
      x: r.next() * width,
      y: height * (0.05 + r.next() * 0.5),
      rx: width * (0.18 + r.next() * 0.25),
      ry: height * (0.05 + r.next() * 0.07),
      speed: 3 + r.next() * 6,
    }))

    roofs = []
    for (let x = -10; x < width + 10; ) {
      const w = 26 + r.next() * 54
      const h = height * (0.05 + r.next() * 0.09)
      // No lit windows under the caption in the bottom-left corner.
      roofs.push({ x, w, h, peak: r.chance(0.55), lit: x > 400 && r.chance(0.3) })
      x += w + (r.chance(0.2) ? r.next() * 30 : 0)
    }
  }

  function step(dt) {
    elapsed += dt
    const { precip } = forecast
    const sway = MOTIONS[precip.motion].sway
    const margin = 60
    for (const p of particles) {
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.rotation += p.spin * dt
      if (p.y > height + margin) p.y = -margin
      if (p.y < -margin) p.y = height + margin
      if (p.x < -margin * 2) p.x = width + margin
      if (p.x > width + margin * 2) p.x = -margin
      p.offset = Math.sin(elapsed * 0.9 + p.phase) * sway * p.depth
    }
    for (const c of clouds) {
      c.x += c.speed * dt
      if (c.x - c.rx > width) c.x = -c.rx
    }
  }

  function draw() {
    if (!forecast) return
    const { stops, ink } = forecast.sky

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    stops.forEach((color, i) => gradient.addColorStop(i / (stops.length - 1), color))
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    for (const c of clouds) {
      const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.rx)
      glow.addColorStop(0, 'rgba(255,255,255,0.22)')
      glow.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.ellipse(c.x, c.y, c.rx, c.ry * 2.2, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const sprite = silhouette(forecast.precip.glyph, ink)
    // Far particles first, so near ones overlap them.
    const ordered = [...particles].sort((a, b) => a.depth - b.depth)
    for (const p of ordered) {
      const isDrift = forecast.precip.motion === 'drift'
      const x = p.x + (isDrift ? 0 : p.offset || 0)
      const y = p.y + (isDrift ? p.offset || 0 : 0)
      const tilt = forecast.precip.motion === 'flutter' ? Math.sin(elapsed * 1.3 + p.phase) * 0.5 : p.rotation
      ctx.save()
      ctx.globalAlpha = 0.3 + p.depth * 0.6
      ctx.translate(x, y)
      ctx.rotate(tilt)
      ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size)
      ctx.restore()
    }

    ctx.fillStyle = ink
    for (const roof of roofs) {
      const top = height - roof.h
      ctx.beginPath()
      ctx.moveTo(roof.x, height)
      ctx.lineTo(roof.x, top)
      if (roof.peak) ctx.lineTo(roof.x + roof.w / 2, top - roof.w * 0.35)
      ctx.lineTo(roof.x + roof.w, top)
      ctx.lineTo(roof.x + roof.w, height)
      ctx.fill()
    }
    ctx.fillStyle = forecast.sky.stops[forecast.sky.stops.length - 1]
    for (const roof of roofs) {
      if (!roof.lit) continue
      ctx.globalAlpha = 0.85
      ctx.fillRect(roof.x + roof.w * 0.4, height - roof.h * 0.6, 6, 8)
    }
    ctx.globalAlpha = 1

    ctx.fillStyle = grain(ctx)
    ctx.fillRect(0, 0, width, height)
  }

  function loop(now) {
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
    last = now
    step(dt)
    draw()
    frame = requestAnimationFrame(loop)
  }

  function start() {
    cancelAnimationFrame(frame)
    last = 0
    if (reducedMotion.matches) {
      step(0)
      draw()
    } else {
      frame = requestAnimationFrame(loop)
    }
  }

  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  reducedMotion.addEventListener('change', start)

  return {
    setForecast(next) {
      forecast = next
      elapsed = 0
      resize()
      start()
    },
  }
}

function lerp([min, max], t) {
  return min + (max - min) * t
}

/** A faint film-grain texture laid over the sky. */
function makeGrain() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(size, size)
  for (let i = 0; i < image.data.length; i += 4) {
    const v = Math.random() * 255
    image.data[i] = image.data[i + 1] = image.data[i + 2] = v
    image.data[i + 3] = 18
  }
  ctx.putImageData(image, 0, 0)
  let pattern = null
  return (target) => (pattern ??= target.createPattern(canvas, 'repeat'))
}
