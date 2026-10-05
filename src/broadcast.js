const COMPASS = {
  N: 'north', NE: 'northeast', E: 'east', SE: 'southeast',
  S: 'south', SW: 'southwest', W: 'west', NW: 'northwest',
}

/**
 * Rewrite forecast text the way a weather radio voice would say it, spelling
 * out symbols and abbreviations that text-to-speech voices stumble over.
 */
export function speakable(text) {
  return text
    .replace(/(-?\d+)°/g, (_, n) => `${n < 0 ? 'minus ' + Math.abs(n) : n} degrees`)
    .replace(/\bmph\b/g, 'miles per hour')
    .replace(/\binHg\b/g, 'inches of mercury')
    .replace(/(\d) mi\b/g, '$1 miles')
    .replace(/\bRST\b/g, 'R S T')
    .replace(/\bZZZ\b/g, 'Z Z Z')
    .replace(/\bAM\b/g, 'A M')
    .replace(/\bPM\b/g, 'P M')
    .replace(/\bJr\./g, 'Junior')
}

/**
 * Write the script for one forecast's radio broadcast.
 *
 * Returns a list of lines. Each has the text to show on screen and the text
 * to speak, kept short because some browsers cut off long utterances.
 */
export function broadcastScript(f) {
  const lines = []
  const say = (text) => lines.push({ show: text, speak: speakable(text) })

  say(`This is the Somnolent Weather Service, Weather Forecast Office ZZZ, serving ${f.place}.`)
  say(`The following forecast was issued at ${f.issued}.`)

  for (const alert of f.alerts) {
    const article = /^[AEIOU]/.test(alert.title) ? 'an' : 'a'
    say(`The Somnolent Weather Service has issued ${article} ${alert.title}, in effect ${alert.ending}.`)
    say(alert.detail)
  }

  const direction = COMPASS[f.wind.direction] ?? f.wind.direction.toLowerCase()
  say(`Tonight: ${f.headline}.`)
  say(`The temperature is ${f.temperature}°. It feels like ${f.feelsLike}.`)
  say(`Winds ${direction} at ${f.wind.speed} ${f.wind.unit}, ${f.wind.cargo}.`)

  say('And now, the extended forecast.')
  for (const day of f.days.slice(1)) {
    say(`${day.name}: ${day.condition}. High ${day.high}°, low ${day.low}°.`)
  }

  say('This concludes the broadcast. It will repeat until you wake.')
  return lines
}
