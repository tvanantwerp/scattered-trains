# Scattered Trains

Forecasts from the Somnolent Weather Service, Weather Forecast Office ZZZ. Tonight: scattered trains.

**See tonight's forecast:** https://tvanantwerp.github.io/scattered-trains/

None of this is connected to real weather. The idea came from a dream. Every date has its own fixed forecast, so the same date always shows the same sky. "Dream another night" rolls a random one.

The page copies the look of a real National Weather Service forecast: current readings, watches and warnings, a seven-day strip, and an all-caps "area forecast discussion" with `&&` between sections and `$$` at the end.

## Working on it

```sh
pnpm install
pnpm test     # checks the forecast generator
pnpm build    # writes dist/index.html (open it straight from disk)
```

`pnpm build` also writes `dist/fragment.html`, the same page without the outer `<html>` wrapper, for hosts that add their own.

Every push to `main` runs the tests, builds the page and publishes it to GitHub Pages.

## Where things live

- `src/lexicon.js` holds every word list: what falls from the sky, hazards, places, forecasters. Add to these to grow the dream.
- `src/forecast.js` turns a date into a forecast.
- `src/sky.js` draws the animated sky window.
- `src/main.js` fills in the page.
- `src/page.html` and `src/style.css` are the page markup and styles.
