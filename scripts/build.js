/**
 * Bundle the page into self-contained HTML files with the styles and script
 * inlined, so they open straight from disk and publish as a single page.
 *
 * Writes two files to dist/:
 * - index.html: a full document for opening locally
 * - fragment.html: the same page without <html>/<head>/<body>, for hosts
 *   that add their own wrapper (like a Claude artifact)
 */
import { build } from 'esbuild'
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const root = new URL('..', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

const [template, styles, bundle] = await Promise.all([
  read('src/page.html'),
  read('src/style.css'),
  build({ entryPoints: [new URL('src/main.js', root).pathname], bundle: true, format: 'iife', minify: true, write: false }),
])

// Function replacements keep "$" sequences in the code from being read as patterns.
const fragment = template
  .replace('/* STYLES */', () => styles)
  .replace('/* SCRIPT */', () => bundle.outputFiles[0].text.replace(/<\/script/gi, '<\\/script'))

const full = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>*,*::before,*::after{box-sizing:border-box}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${fragment}
</body>
</html>
`

await mkdir(new URL('dist/', root), { recursive: true })
await Promise.all([
  writeFile(new URL('dist/fragment.html', root), fragment),
  writeFile(new URL('dist/index.html', root), full),
])
console.log('Built dist/index.html and dist/fragment.html')
