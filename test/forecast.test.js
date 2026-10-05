import { test } from 'node:test'
import assert from 'node:assert/strict'
import { forecastFor, shiftDate, isDateKey } from '../src/forecast.js'

test('the same date always gives the same forecast', () => {
  assert.deepEqual(
    JSON.stringify(forecastFor('2026-10-05')),
    JSON.stringify(forecastFor('2026-10-05')),
  )
})

test('different dates give different forecasts', () => {
  const headlines = new Set()
  for (let i = 0; i < 30; i++) headlines.add(forecastFor(shiftDate('2026-01-01', i)).headline)
  assert.ok(headlines.size > 20, `only ${headlines.size} distinct headlines in 30 days`)
})

test('the week starts tonight and has seven days', () => {
  const { days } = forecastFor('2026-10-05')
  assert.equal(days.length, 7)
  assert.equal(days[0].name, 'Tonight')
  for (const day of days) assert.ok(day.low < day.high)
})

test('tonight in the seven-day strip matches the current conditions', () => {
  for (let i = 0; i < 100; i++) {
    const f = forecastFor('2026-10-05', `tonight-${i}`)
    assert.equal(f.days[0].condition, f.headline)
    assert.equal(f.days[0].precip, f.precip)
  }
})

test('no generated text has gaps or leftover placeholders', () => {
  for (let i = 0; i < 500; i++) {
    const text = JSON.stringify(forecastFor('2026-10-05', `seed-${i}`))
    assert.doesNotMatch(text, /undefined|NaN|\[object|\$\{/, `seed-${i}`)
  }
})

test('the discussion is all capitals, like a real bulletin', () => {
  for (let i = 0; i < 200; i++) {
    for (const { text } of forecastFor('2026-10-05', `caps-${i}`).discussion) {
      assert.equal(text, text.toUpperCase())
    }
  }
})

test('date helpers handle month ends and bad input', () => {
  assert.equal(shiftDate('2026-02-28', 1), '2026-03-01')
  assert.equal(shiftDate('2026-01-01', -1), '2025-12-31')
  assert.ok(isDateKey('2026-10-05'))
  assert.ok(!isDateKey('2026-02-30'))
  assert.ok(!isDateKey('tuesday'))
})
