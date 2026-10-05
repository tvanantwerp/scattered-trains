import { createRandom } from './random.js'
import * as L from './lexicon.js'

/**
 * Build the full forecast for one night.
 *
 * The same seed always produces the same forecast. Dates are used as seeds so
 * each night has its own fixed weather, while "dream another" passes a random
 * seed instead.
 *
 * @param {string} dateKey  Date in YYYY-MM-DD form; sets the day names.
 * @param {string} [seed]   Defaults to the date.
 */
export function forecastFor(dateKey, seed = dateKey) {
  const r = createRandom(`scattered-trains:${seed}`)

  const place = r.pick(L.PLACES)
  const sky = r.pick(L.SKIES)
  const precip = r.pick(L.PRECIPITATION)
  const qualifier = r.pick(L.QUALIFIERS)
  const skyWord = `${r.pick(L.SKY_PREFIXES)} ${r.pick(L.SKY_WORDS)}`

  const kind = r.pick(['precip', 'precip', 'precip', 'combo', 'combo', 'sky'])
  const headline = {
    precip: `${qualifier.word} ${precip.plural}`,
    combo: `${skyWord} with ${qualifier.word.replace(/^A /, 'a ')} ${precip.plural}`,
    sky: skyWord,
  }[kind]
  // A plain sky headline still lets some strays through, so the window is never empty.
  const density = kind === 'sky' ? 0.2 : qualifier.density

  const temperature = r.int(18, 97)
  const wind = {
    direction: r.pick(L.WIND_DIRECTIONS),
    speed: r.int(2, 28),
    unit: r.pick(L.WIND_UNITS),
    cargo: r.pick(L.WIND_CARGO),
  }

  const later = { qualifier: r.pick(L.QUALIFIERS), precip: r.pick(L.PRECIPITATION) }

  const forecast = {
    dateKey,
    seed,
    office: 'ZZZ',
    issued: `${r.int(1, 4)}:${String(r.int(0, 59)).padStart(2, '0')} AM RST`,
    place,
    sky,
    precip,
    qualifier,
    density,
    headline,
    later,
    amount: r.pick(L.AMOUNTS),
    temperature,
    feelsLike: r.pick(L.FEELS_LIKE),
    wind,
    readings: [
      { label: 'Wind', value: `${wind.direction} at ${wind.speed} ${wind.unit}`, note: wind.cargo },
      { label: 'Humidity', value: `${r.int(12, 100)}%`, note: r.pick(L.HUMIDITY_SOURCES) },
      { label: 'Pressure', value: `${(29 + r.next() * 1.4).toFixed(2)} inHg`, note: r.pick(L.PRESSURE_TRENDS) },
      { label: 'Visibility', value: `${r.int(1, 10)} mi`, note: r.pick(L.VISIBILITY_ENDINGS) },
      { label: 'Dew point', value: `${temperature - r.int(3, 30)}°`, note: 'the same as last year' },
      { label: 'UV index', value: `${r.int(0, 11)} of 11`, note: r.pick(L.UV_ADVICE) },
    ],
    days: buildDays(r, dateKey, temperature),
    alerts: buildAlerts(r),
    almanac: {
      sunrise: `${r.int(5, 7)}:${String(r.int(0, 59)).padStart(2, '0')} AM, briefly`,
      sunset: r.pick(L.SUNSETS),
      moon: `${r.pick(L.MOON_PHASES)}, ${r.pick(L.MOON_ASIDES)}`,
      tide: `High tide ${r.int(1, 12)}:${String(r.int(0, 59)).padStart(2, '0')} PM in ${r.pick(L.TIDE_LOCATIONS)}`,
    },
    forecaster: r.pick(L.FORECASTERS),
  }

  // Tonight in the seven-day strip is the same night as the current conditions.
  Object.assign(forecast.days[0], {
    condition: headline,
    precip,
    chance: Math.max(10, Math.round(density * 10) * 10),
  })

  // The discussion reads from the finished forecast, so it is built last.
  const shout = {
    ...forecast,
    place: place.toUpperCase(),
    precip: upper(precip),
    qualifier: upper(qualifier),
    wind: upper(wind),
    later: { qualifier: upper(later.qualifier), precip: upper(later.precip) },
  }
  forecast.discussion = [
    { heading: 'SYNOPSIS', text: r.pick(L.SYNOPSIS)(shout) },
    { heading: 'NEAR TERM /TONIGHT/', text: r.pick(L.NEAR_TERM)(shout) },
    { heading: 'LONG TERM /THE REST OF THE WEEK, ROUGHLY/', text: r.pick(L.LONG_TERM)(shout) },
    { heading: 'AVIATION', text: r.pick(L.AVIATION)(shout) },
    { heading: 'MARINE', text: r.pick(L.MARINE)(shout) },
  ]

  return forecast
}

/** Uppercase every string value of an object, for the all-caps discussion. */
function upper(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, typeof v === 'string' ? v.toUpperCase() : v]))
}

function buildDays(r, dateKey, startTemp) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const firstWeekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  let high = startTemp
  const days = []
  for (let i = 0; i < 7; i++) {
    const realName = L.DAY_NAMES[(firstWeekday + i) % 7]
    const name = i === 0 ? 'Tonight' : r.chance(0.2) ? r.pick(L.DAY_SLIPS[realName]) : realName
    high = Math.max(-5, Math.min(110, high + r.int(-14, 14)))
    const precip = r.pick(L.PRECIPITATION)
    const qualifier = r.pick(L.QUALIFIERS)
    days.push({
      name,
      high,
      low: high - r.int(6, 25),
      precip,
      condition: r.chance(0.25) ? `${r.pick(L.SKY_PREFIXES)} ${r.pick(L.SKY_WORDS)}` : `${qualifier.word} ${precip.plural}`,
      chance: r.int(1, 10) * 10,
    })
  }
  return days
}

function buildAlerts(r) {
  const count = r.pick([0, 1, 1, 2, 2, 3])
  return r.sample(L.HAZARDS, count).map((hazard) => {
    const level = r.pick(L.ALERT_LEVELS)
    return {
      level,
      title: `${hazard.name} ${level}`,
      ending: r.pick(L.ALERT_ENDINGS),
      detail: hazard.detail,
    }
  })
}

/** Today's date in the viewer's own time zone, as YYYY-MM-DD. */
export function todayKey(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Move a YYYY-MM-DD date by a number of days. */
export function shiftDate(dateKey, days) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d + days))
  return date.toISOString().slice(0, 10)
}

/** Check that a string is a real YYYY-MM-DD date. */
export function isDateKey(text) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false
  return shiftDate(text, 0) === text
}
