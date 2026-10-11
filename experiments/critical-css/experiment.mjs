import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import Beasties from 'beasties';
const root = path.resolve(process.env.FITD_EXPERIMENT_DIR || '.artifacts');
const exportDir = path.resolve(process.argv[2] || '../../out');
await fs.cp(exportDir, `${root}/baseline`, { recursive: true });
await fs.cp(exportDir, `${root}/optimized`, { recursive: true });
const processor = new Beasties({ path: `${root}/optimized`, preload: 'media', pruneSource: false, inlineFonts: true, preloadFonts: false, allowRules: [/dark/], logLevel: 'error' });
const stats = [];
async function walk(dir) {
 for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) await walk(file);
  else if (entry.name.endsWith('.html')) {
   const html = await fs.readFile(file, 'utf8');
   const result = await processor.process(html);
   await fs.writeFile(file, result);
   stats.push({ route: path.relative(`${root}/optimized`,file), originalGzip: gzipSync(html).length, optimizedGzip: gzipSync(result).length, inlineBytes: [...result.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce((n,m)=>n+Buffer.byteLength(m[1]),0) });
  }
 }
}
await walk(`${root}/optimized`);
await fs.writeFile(`${root}/stats.json`, JSON.stringify(stats,null,2));
console.log('Processed HTML files:', stats.length);
console.log(stats.filter(s=>['index.html','clanky/index.html','stranky/kontakt/index.html','clanky/omega-3-epa-dha-davkovanie-a-vyber/index.html'].includes(s.route)));
