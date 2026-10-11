import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const root=path.resolve(process.env.FITD_EXPERIMENT_DIR || '.artifacts');
const server=http.createServer(async(req,res)=>{
 try {
 const u=new URL(req.url,'http://localhost');const parts=u.pathname.split('/').filter(Boolean);const variant=parts.shift();let file=path.join(root,variant,...parts);if((await fs.stat(file)).isDirectory()) file=path.join(file,'index.html');
 const b=await fs.readFile(file);const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.png':'image/png'})[ext]||'application/octet-stream');res.setHeader('Content-Encoding','gzip');res.end(gzipSync(b));
 }catch {res.statusCode=404;res.end('Not found');}
});
await new Promise(r=>server.listen(8137,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const routes=['/','/clanky/','/clanky/omega-3-epa-dha-davkovanie-a-vyber/','/stranky/kontakt/'];
const reports=[];
// Assets retain root-relative URLs, so map them to each variant.
async function pageFor(variant,width,dark=false,javaScriptEnabled=true){
 const context=await browser.newContext({viewport:{width,height:900},colorScheme:dark?'dark':'light',javaScriptEnabled}); const page=await context.newPage();
 await page.route('http://127.0.0.1:8137/_next/**',r=>r.continue({url:r.request().url().replace('/_next/',`/${variant}/_next/`)}));
 await page.route('https://**',r=>r.abort());
 return {page,context};
}
for(const width of [390,1440]) for(const dark of [false,true]) for(const route of routes){
 const shots=[];const errors=[];
 for(const variant of ['baseline','optimized']){
 const {page,context}=await pageFor(variant,width,dark);page.on('pageerror',e=>errors.push(variant+': '+e.message));
 await page.goto(`http://127.0.0.1:8137/${variant}${route}`,{waitUntil:'networkidle'});
 const reject=page.getByRole('button',{name:'Odmietnuť',exact:true});if(await reject.isVisible())await reject.click();
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(1200);
 if(width===390&&!dark)await page.screenshot({path:`${root}/${variant}-${route.replaceAll('/','_')||'home'}.png`});
 shots.push(PNG.sync.read(await page.screenshot()));
 if(variant==='optimized' && width===390 && !dark && route==='/')await page.screenshot({path:`${root}/optimized-mobile.png`});
 await context.close();
 }
 let changed=0;for(let i=0;i<shots[0].data.length;i+=4){if([0,1,2].some(j=>Math.abs(shots[0].data[i+j]-shots[1].data[i+j])>10))changed++;}
 reports.push({width,dark,route,changedPixels:changed,pixels:shots[0].width*shots[0].height,errors});console.log(reports.at(-1));
}
for(const variant of ['baseline','optimized']) {
 const {page,context}=await pageFor(variant,390);
 await page.goto(`http://127.0.0.1:8137/${variant}/`,{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Odmietnuť',exact:true}).click();
 await page.getByRole('button',{name:'Toggle Menu'}).click();
 await page.getByRole('dialog').waitFor({state:'visible'});
 console.log('MOBILE MENU',variant,'visible',await page.getByRole('dialog').isVisible());
 await context.close();
}
const performance=[];
for(let run=0;run<3;run++)for(const variant of ['baseline','optimized']){
 const {page,context}=await pageFor(variant,390);
 await page.addInitScript(()=>{window.testLcp=0;window.testCls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())window.testLcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.testCls+=e.value}).observe({type:'layout-shift',buffered:true});});
 const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.goto(`http://127.0.0.1:8137/${variant}/`,{waitUntil:'networkidle'});await page.waitForTimeout(1000);
 const data=await page.evaluate(()=>({fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,lcp:window.testLcp,cls:window.testCls,blockingStyles:[...document.querySelectorAll('link[rel="stylesheet"]')].filter(l=>!l.media||l.media==='all').length}));performance.push({variant,run,...data});console.log('TIMING',performance.at(-1));await context.close();
}
const {page,context}=await pageFor('optimized',390,false,false);await page.goto('http://127.0.0.1:8137/optimized/',{waitUntil:'networkidle'});console.log('NOSCRIPT',await page.locator('body').evaluate(e=>getComputedStyle(e).fontFamily));await context.close();
await fs.writeFile(`${root}/verification.json`,JSON.stringify({reports,performance},null,2));await browser.close();server.close();
