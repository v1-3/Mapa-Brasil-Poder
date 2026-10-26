import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {WEIGHTS,score,summarize,parseState,stateHash,csvCell} from '../docs/model.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const read=n=>JSON.parse(fs.readFileSync(path.join(root,'docs',n),'utf8'));
const d=read('data.json'),c=read('content.json'),imgs=read('images.json').images;const sources=new Map([...d.sources,...c.sources].map(s=>[s.id,s]));let checks=0;const ok=(value,label)=>{assert.ok(value,label);checks++;};
ok(d.years.length===80&&new Set(d.years).size===80,'80 distinct annual profiles');ok(Object.values(WEIGHTS).reduce((a,b)=>a+b,0)===100,'weights total 100');
const example=score({id:'X',chamberShare:.25,governorShare:.1,senateShare:.5},{president:'X',speaker:'Y',senatePresident:'X'});ok(example.value===40&&!example.partial,'independent example: 9+2+7+15+0+7 = 40');
const partial=score({id:'X',chamberShare:.25,governorShare:null,senateShare:null},{president:'X',speaker:'Y',senatePresident:'Y'});ok(partial.partial&&partial.value===24,'missing shares remain partial, not renormalized');
for(const y of d.years){const s=d.snapshots[y],ids=s.rows.map(r=>r.id),sum=summarize(s);ok(new Set(ids).size===ids.length,'unique party rows '+y);ok(Math.abs(sum.allocated+sum.residual-100)<1e-8,'accounting '+y);ok(sum.allocated<=100+1e-8,'no overflow '+y);
 for(const r of s.rows){ok(d.parties.some(p=>p.id===r.id),'party exists '+r.id);for(const k of ['chamberShare','governorShare','senateShare'])ok(r[k]===null||Number.isFinite(r[k])&&r[k]>=0&&r[k]<=1,'valid share');}
 for(const key of ['president','speaker','senatePresident']){ok(s.officeholders[key].name.trim().length>3,'named officeholder '+y);ok(s.offices[key]===null||ids.includes(s.offices[key]),'office party present '+y);for(const id of s.officeholders[key].sourceIds)ok(sources.has(id),'office citation '+id);}
 for(const id of s.sources)ok(sources.has(id),'year citation '+id);
}
ok(d.snapshots[2016].offices.speaker==='PP'&&d.snapshots[2016].officeholders.speaker.name==='Waldir Maranhão'&&d.snapshots[2016].officeholders.speaker.acting,'2016 acting speaker');
ok(d.snapshots[1947].rows.find(r=>r.id==='PST (1946)').name==='PPB (1946)','1947 name before July rename');
ok(!d.snapshots[2022].rows.some(r=>['DEM','PSL'].includes(r.id)),'2022 merger');ok(d.snapshots[1985].rows.some(r=>r.id==='DEM'),'1985 PFL present');
for(const y of [1979,1982])ok(!d.snapshots[y].rows.some(r=>r.id==='PP (1979)'),'PP dates '+y);
for(const y of [1992,1993,1994])ok(!d.snapshots[y].rows.some(r=>r.id==='PRS'),'PRS withdrawn '+y);
for(const y of d.years.filter(y=>y<1995||y>=2019))ok(d.snapshots[y].rows.every(r=>r.senateShare===null),'unreliable Senate component withheld '+y);
ok(summarize(d.snapshots[1969]).rows.every(r=>r.parts.filter(p=>['speaker','senatePresident','chamberShare','senateShare'].includes(p.key)).every(p=>p.points===null)),'closed Congress not awarded points');
ok(d.parties.some(p=>p.id==='PTN (1945)')&&d.parties.some(p=>p.id==='PODE'),'separate PTNs');
ok(d.snapshots[2016].rows.find(r=>r.id==='PL').name==='PR','PR historical label');
ok(d.snapshots[2019].rows.find(r=>r.id==='REPUBLICANOS').name==='PRB','PRB in July 2019');
ok(d.snapshots[2019].rows.find(r=>r.id==='CIDADANIA').name==='PPS','PPS in July 2019');
ok(d.snapshots[2020].rows.find(r=>r.id==='REPUBLICANOS').name==='Republicanos','Republicanos by July 2020');
for(const p of d.parties)ok(p.fullName.length>2&&p.first<=p.last,'named party '+p.id);
function bilingual(x){if(!x||typeof x!=='object')return;if('pt'in x||'en'in x)ok(x.pt&&x.en,'both languages present');for(const v of Object.values(x))if(typeof v==='object')bilingual(v);}
bilingual(d);bilingual(c);bilingual(imgs);
for(const p of c.periods){for(const id of [...p.sourceIds,...p.events.flatMap(e=>e.sourceIds)])ok(sources.has(id),'content citation '+id);for(const y of d.years.filter(y=>y>=p.start&&y<=p.end))ok(c.periods.filter(p=>y>=p.start&&y<=p.end).length===1,'no overlapping periods '+y);}
ok(imgs.length===8,'eight photos');for(const img of imgs){ok(fs.existsSync(path.join(root,'docs',img.src)),'image exists');ok(img.credit&&img.license&&img.sourceUrl.startsWith('https://')&&img.licenseUrl.startsWith('https://'),'photo attribution');}
for(const s of sources.values())ok(s.url.startsWith('https://'),'HTTPS citation');
for(const correction of d.corrections)for(const id of correction.sourceIds)ok(sources.has(id),'correction citation');
const state={year:2016,party:'PP',lang:'en'};assert.deepEqual(parseState(stateHash(state),d.years,d.parties),state);assert.equal(parseState('#1979',d.years,d.parties).year,1979);assert.deepEqual(parseState('#year=9999&party=missing&lang=xx',d.years,d.parties),{year:2026,party:'',lang:'pt'});ok(csvCell('a,"b')==='"a,""b"','CSV escaping');
for(const name of ['index.html','styles.css','app.js','history.html','model.mjs'])ok(fs.existsSync(path.join(root,'docs',name)),'entry asset '+name);
console.log(`PASS: ${checks} assertions; 80 annual profiles, 240 named offices, bilingual content, citations, model arithmetic, regression cases and local assets.`);
