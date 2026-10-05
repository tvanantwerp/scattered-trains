import { forecastFor, todayKey, shiftDate, isDateKey } from './forecast.js'
import { createSky, silhouette } from './sky.js'
import { broadcastScript } from './broadcast.js'
import { createRadio, canBroadcast } from './radio.js'

const $ = (id) => document.getElementById(id)

/** Make an element with optional class and text. */
function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}

const sky = createSky($('sky'))
let current = { dateKey: todayKey(), seed: null }
let shown = null

const radio = canBroadcast()
  ? createRadio({
      onLine: (text) => ($('radio-line').textContent = text),
      onState: (playing) => {
        $('listen').setAttribute('aria-pressed', String(playing))
        $('listen-label').textContent = playing ? 'Stop the broadcast' : 'Listen to the broadcast'
      },
    })
  : null

if (radio) {
  $('radio').hidden = false
  $('listen').addEventListener('click', () => {
    if (radio.playing) return radio.stop()
    // Real weather radio only sounds the long alert tone for watches and warnings.
    const withAlert = shown.alerts.some((alert) => alert.level !== 'Advisory')
    radio.play(broadcastScript(shown), { withAlert })
  })
}

function longDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)))
}

/** White silhouette as a data URL, used as a CSS mask so it takes the theme's ink color. */
function maskFor(glyph) {
  return `url(${silhouette(glyph, '#fff').toDataURL()})`
}

function render() {
  const f = forecastFor(current.dateKey, current.seed ?? current.dateKey)
  shown = f
  // A broadcast belongs to one night; switching nights ends it.
  if (radio?.playing) radio.stop()

  $('place').textContent = f.place
  $('sky-place').textContent = f.place
  $('date-long').textContent = longDate(f.dateKey)
  $('issued').textContent = f.issued
  $('headline').textContent = f.headline
  $('temp').textContent = f.temperature
  $('feels').textContent = f.feelsLike
  document.title = `${f.headline} · Scattered Trains`

  $('readings').replaceChildren(
    ...f.readings.map(({ label, value, note }) => {
      const row = el('div')
      const dd = el('dd')
      dd.append(el('span', 'value', value), el('span', 'note', note))
      row.append(el('dt', null, label), dd)
      return row
    }),
  )

  $('alerts').replaceChildren(
    ...f.alerts.map((alert) => {
      const box = el('div', 'alert')
      box.dataset.level = alert.level
      const title = el('h3', null, `${alert.title} `)
      title.append(el('span', null, `in effect ${alert.ending}`))
      box.append(el('span', 'level', alert.level), title, el('p', null, alert.detail))
      return box
    }),
  )

  $('days').replaceChildren(
    ...f.days.map((day) => {
      const item = el('li', 'day')
      const glyph = el('span', 'glyph')
      glyph.style.maskImage = glyph.style.webkitMaskImage = maskFor(day.precip.glyph)
      glyph.setAttribute('role', 'img')
      glyph.setAttribute('aria-label', day.precip.plural)
      const range = el('span', 'range', `${day.high}° `)
      range.append(el('span', 'low', `${day.low}°`))
      item.append(
        el('span', 'name', day.name),
        glyph,
        el('span', 'condition', day.condition),
        el('span', 'chance', `${day.chance}% chance`),
        range,
      )
      return item
    }),
  )

  renderDiscussion(f)

  $('almanac').replaceChildren(
    ...[
      ['Sunrise', f.almanac.sunrise],
      ['Sunset', f.almanac.sunset],
      ['Moon', f.almanac.moon],
      ['Tides', f.almanac.tide],
    ].flatMap(([label, value]) => [el('dt', null, label), el('dd', null, value)]),
  )

  sky.setForecast(f)
}

/** Lay out the discussion like a teletype bulletin, with section headers and "&&" breaks. */
function renderDiscussion(f) {
  const stamp = longDate(f.dateKey).toUpperCase().replace(/,/g, '')
  const parts = [
    `AREA FORECAST DISCUSSION\nSOMNOLENT WEATHER SERVICE ${f.office}\n${f.issued} ${stamp}\n\n`,
  ]
  const nodes = [document.createTextNode(parts[0])]
  f.discussion.forEach(({ heading, text }, i) => {
    nodes.push(el('span', 'head', `.${heading}...`))
    nodes.push(document.createTextNode(`\n${text}\n\n${i < f.discussion.length - 1 ? '&&\n\n' : ''}`))
  })
  nodes.push(document.createTextNode(`$$\n\nFORECASTER: ${f.forecaster}`))
  $('afd').replaceChildren(...nodes)
}

/** Load the date in the address bar, if there is one. */
function readHash() {
  const hash = location.hash.slice(1)
  current = { dateKey: isDateKey(hash) ? hash : todayKey(), seed: null }
  render()
}

function goTo(dateKey) {
  if (location.hash.slice(1) === dateKey) {
    current = { dateKey, seed: null }
    render()
  } else {
    location.hash = dateKey
  }
}

$('prev').addEventListener('click', () => goTo(shiftDate(current.dateKey, -1)))
$('next').addEventListener('click', () => goTo(shiftDate(current.dateKey, 1)))
$('today').addEventListener('click', () => goTo(todayKey()))
$('dream').addEventListener('click', () => {
  current = { dateKey: current.dateKey, seed: Math.random().toString(36).slice(2) }
  render()
})
window.addEventListener('hashchange', readHash)

readHash()
