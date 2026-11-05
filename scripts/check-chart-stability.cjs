const {chromium}=require('C:/Users/victo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('url');
const path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.ATLAS_URL||pathToFileURL(path.resolve('docs/history.html')).href);
  await page.evaluate(()=>document.fonts.ready);
  for(const width of [390,1280,1500,1920]){
   await page.setViewportSize({width,height:900});
   await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,0)});
   await page.locator('#hover-follow').evaluate(el=>el.checked=false);
   const positions=[];
   const measure=()=>page.locator('#c').evaluate(el=>{const r=el.getBoundingClientRect();return {top:r.top+scrollY,height:r.height,scroll:scrollY}});
   let baseline;
   let drift=0;
   for(const lang of ['pt','en']){
    await page.locator('#lang-'+lang).click();
    baseline=await measure();
    for(const year of [1822,1831,1889,1937,1946,1964,1988,2026]){
     await page.locator('#jump').evaluate((el,y)=>{el.value=y;el.dispatchEvent(new Event('change'))},year);
     await page.evaluate(()=>new Promise(requestAnimationFrame));
     const position=await measure();positions.push(position);
     drift=Math.max(drift,Math.abs(position.top-baseline.top));
    }
   }
   const yearChecks=positions.length;
   // Pointer following must not move the plot beneath the pointer.
   await page.locator('#hover-follow').evaluate(el=>el.checked=true);
   await page.locator('#c').scrollIntoViewIfNeeded();
   const chart=await page.locator('#c').boundingBox();
   for(let i=1;i<10;i++){
    await page.mouse.move(chart.x+Math.min(chart.width, width-chart.x-10)*i/10,chart.y+chart.height/2);
    await page.evaluate(()=>new Promise(requestAnimationFrame));
    positions.push(await measure());
   }
   for(const strand of ['1','2','']){
    await page.locator('#strand-select').evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('change'))},strand);
    await page.evaluate(()=>new Promise(requestAnimationFrame));
    positions.push(await measure());
   }
   for(const scroll of [200,400,600]){
    await page.evaluate(y=>scrollTo(0,y),scroll);
    for(const year of [1822,1964,2026]){
     await page.locator('#jump').evaluate((el,y)=>{el.value=y;el.dispatchEvent(new Event('change'))},year);
     await page.evaluate(()=>new Promise(requestAnimationFrame));
     positions.push(await measure());
    }
   }
   drift=Math.max(drift,...positions.slice(yearChecks).map(r=>Math.abs(r.top-baseline.top)));
   if(drift>1)throw Error('Chart moved at width '+width+': '+drift+'px');
   console.log(JSON.stringify({width,checks:positions.length,drift}));
  }
  if(errors.length)throw Error(errors.join('; '));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
