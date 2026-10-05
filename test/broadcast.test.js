import { test } from 'node:test'
import assert from 'node:assert/strict'
import { forecastFor } from '../src/forecast.js'
import { broadcastScript, speakable } from '../src/broadcast.js'

test('symbols and abbreviations are spelled out for the voice', () => {
  assert.equal(speakable('High 41°, low -5°.'), 'High 41 degrees, low minus 5 degrees.')
  assert.equal(speakable('N at 13 mph'), 'N at 13 miles per hour')
  assert.equal(speakable('29.37 inHg, 4 mi'), '29.37 inches of mercury, 4 miles')
  assert.equal(speakable('Issued 3:21 AM RST by ZZZ'), 'Issued 3:21 A M R S T by Z Z Z')
  assert.equal(speakable('Friday Jr.'), 'Friday Junior')
})

test('the broadcast covers alerts, tonight and the rest of the week', () => {
  for (let i = 0; i < 100; i++) {
    const f = forecastFor('2026-10-05', `radio-${i}`)
    const shown = broadcastScript(f).map((line) => line.show).join('\n')
    assert.ok(shown.includes(f.headline))
    for (const alert of f.alerts) assert.ok(shown.includes(alert.title))
    for (const day of f.days.slice(1)) assert.ok(shown.includes(day.name))
  }
})

test('alerts use "an" before vowel sounds', () => {
  for (let i = 0; i < 300; i++) {
    for (const { show } of broadcastScript(forecastFor('2026-10-05', `article-${i}`))) {
      assert.doesNotMatch(show, /\ba [AEIOU]/, show)
    }
  }
})

test('spoken lines have no leftover symbols or gaps', () => {
  for (let i = 0; i < 300; i++) {
    for (const { speak } of broadcastScript(forecastFor('2026-10-05', `speak-${i}`))) {
      assert.doesNotMatch(speak, /°|\bmph\b|\binHg\b|undefined|NaN/, speak)
    }
  }
})
