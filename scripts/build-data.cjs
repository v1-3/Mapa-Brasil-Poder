// Rebuild the published model inputs: node scripts/build-data.cjs
// The legacy file contains estimates, not official annual rosters. Corrections
// remove demonstrably invalid assignments without inventing replacement counts.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const input = JSON.parse(fs.readFileSync(path.join(__dirname, 'legacy-input.json'), 'utf8'));
const bi = (pt, en) => ({pt, en});
const sources = [
  {id:'tse-uniao',title:'TSE — União Brasil: fusão DEM–PSL (8/2/2022)',url:'https://www.tse.jus.br/comunicacao/noticias/2022/Fevereiro/tse-aprova-registro-do-partido-uniao-brasil'},
  {id:'tse-history',title:'TSE — histórico de partidos políticos',url:'https://www.tse.jus.br/servicos-eleitorais/glossario/termos/partido-politico'},
  {id:'tse-register',title:'TSE — partidos, alterações de nome e fusões',url:'https://www.tse.jus.br/partidos/partidos-registrados-no-tse/registrados-no-tse'},
  {id:'tse-ptn-old',title:'TSE — Partido Trabalhista Nacional histórico',url:'https://www.tse.jus.br/partidos/partidos-registrados-no-tse/historico/registros-de-partidos-politicos-1945-a-1979-1/partido-trabalhista-nacional'},
  {id:'camara-two-parties',title:'Câmara — o sistema de dois partidos',url:'https://www.camara.leg.br/noticias/90158-apenas-dois-partidos-no-regime-militar-2'},
  {id:'fgv-pp',title:'FGV — Partido Popular, criado em dezembro de 1979',url:'https://atlas.fgv.br/verbete/6179'},
  {id:'camara-chagas',title:'Câmara — mandatos de Chagas Freitas',url:'https://www.camara.leg.br/deputados/131180/biografia'},
  {id:'camara-pfl',title:'Câmara — bancada do PFL reconhecida em 1985',url:'https://www2.camara.leg.br/legin/int/atomes/1980-1987/atodamesa-56-2-abril-1985-321744-norma-cd-mesa.html'},
  {id:'camara-waldir',title:'Câmara — Waldir Maranhão (PP), presidente em exercício em maio de 2016',url:'https://www.camara.leg.br/noticias/487872-waldir-maranhao-diz-que-nao-vai-renunciar/'},
  {id:'camara-cunha',title:'Câmara — suspensão de Cunha, efetiva desde 5/5/2016',url:'https://www2.camara.leg.br/legin/int/atomes/2016/atodamesa-88-12-maio-2016-783108-publicacaooriginal-150381-cd-mesa.html'},
  {id:'senado-rede',title:'Senado — composição das bancadas em fevereiro de 2021',url:'https://www12.senado.leg.br/noticias/materias/2021/02/01/na-abertura-do-ano-legislativo-16-legendas-tem-representantes-no-senado'},
  {id:'senado-randolfe',title:'Senado — Randolfe, único senador da Rede em junho de 2022',url:'https://www25.senado.leg.br/web/atividade/pronunciamentos/-/p/pronunciamento/491787'},
  {id:'tse-representation',title:'TSE — representatividade eleitoral de partidos e federações; não é uma lista de filiações em 1º de julho',url:'https://www.tse.jus.br/eleicoes/tabela-com-a-representatividade-dos-partidos-politicos-e-das-federacoes-na-camara-dos-deputados-e-no-senado-federal'},
  {id:'camara-pcb',title:'Câmara — extinção dos mandatos do PCB em janeiro de 1948',url:'https://www2.camara.leg.br/legin/fed/resmes_sn/1940-1949/resolucaodamesa-3-10-janeiro-1948-344466-publicacaooriginal-1-cd.html'}
];
const corrections = [];
const snapshots = {};
function idAt(id, y) {
  if (id === 'PODE' && y < 1966) return 'PTN (1945)';
  if (id === 'PDC' && y < 1966) return 'PDC (1945)';
  if (id === 'PST' && y < 1966) return 'PST (1946)';
  if (id === 'PSB' && y < 1966) return 'PSB (1947)';
  if (id === 'PRP' && y < 1966) return 'PRP (1945)';
  if (id === 'PP (1980)→MDB') return 'PP (1979)';
  return id;
}
function officeId(label, y) {
  if (label == null) return null;
  const aliases = {PMDB:'MDB',ARENA:'PP',PDS:'PP',PPR:'PP',PPB:'PP',PFL:'DEM',PCdoB:'PCDOB','União Brasil':'UNIÃO'};
  if (label === 'PTN') return y < 1966 ? 'PTN (1945)' : 'PODE';
  return idAt(aliases[label] || label, y);
}
const shares = ['chamberShare','governorShare','senateShare'];
function row(y,id,name=id) {
  const s=snapshots[y]; let r=s.rows.find(r=>r.id===id);
  if (!r) { r={id,name,chamberShare:null,governorShare:null,senateShare:null};s.rows.push(r); }
  return r;
}
function note(years, pt, en, sourceIds=[]) {
  corrections.push({years,description:bi(pt,en),sourceIds});
  for(const y of years) {
    snapshots[y].notes.pt.push(pt); snapshots[y].notes.en.push(en);
    snapshots[y].sources=[...new Set([...snapshots[y].sources,...sourceIds])];
  }
}
for(const y of input.years) {
  const old=input.snapshots[y];
  snapshots[y]={
    offices:{president:officeId(old.offices[0],y),speaker:officeId(old.offices[1],y),senatePresident:officeId(old.offices[2],y)},
    rows:old.rows.map(r=>({id:idAt(r.id,y),name:r.name==='PP (1980)→MDB'?'PP (1979)':r.name,chamberShare:r.chamberEquivalent/513,governorShare:r.governorEquivalent/27,senateShare:r.senateEquivalent/81})),
    quality:y<1995?'estimated':'mixed',
    notes:{pt:[],en:[]},sources:[]
  };
}
// Known impossible identities are removed; their ambiguous allocations are not
// reassigned to another party without an individual historical roster.
for(const y of [1979,1982]) {
  snapshots[y].rows=snapshots[y].rows.filter(r=>r.id!=='PP (1979)');
  for(const r of snapshots[y].rows) r.chamberShare=r.senateShare=null;
}
note([1979,1982],
  'O PP de Tancredo e Chagas foi criado em dezembro de 1979 e incorporado ao PMDB em 1982. Foi retirado dos recortes de julho de 1979 e 1982; as parcelas legislativas desses anos ficam indisponíveis até a reconstrução das filiações.',
  'Tancredo and Chagas’s PP was created in December 1979 and absorbed into PMDB in 1982. It is removed from the July 1979 and 1982 profiles; legislative shares for those years remain unavailable pending an affiliation reconstruction.',
  ['fgv-pp','camara-two-parties']);
// We know the all-government-party allocation is false, but the imported file
// does not establish a consistent historical state/territory/DF denominator.
for(const y of [1979,1980,1981,1982]) for(const r of snapshots[y].rows) r.governorShare=null;
note([1979,1980,1981,1982],
  'Chagas Freitas governou o Rio de Janeiro entre 1979 e 1983, fora da Arena/PDS. A antiga atribuição de todos os governos estaduais à Arena/PDS foi retirada; a distribuição completa permanece indisponível, não zero.',
  'Chagas Freitas governed Rio de Janeiro from 1979 to 1983 outside ARENA/PDS. The old allocation of every state government to ARENA/PDS is withdrawn; the complete distribution remains unavailable, not zero.',
  ['camara-chagas','fgv-pp']);
for(const y of [1985,1986]) {
  row(y,'DEM','PFL');
  // The old PDS numbers cannot be separated from the breakaway PFL reliably.
  for(const r of snapshots[y].rows) for(const k of shares) r[k]=null;
}
note([1985,1986],
  'O PFL já tinha bancada em 1985. Foi incluído como organização presente, mas as parcelas de Câmara, Senado e governos estaduais não foram inventadas: a base antiga não separava corretamente a cisão do PDS.',
  'PFL already had a parliamentary group in 1985. It is included as a present organization, but Chamber, Senate and governor shares are not invented: the legacy inputs did not correctly separate the PDS split.',
  ['camara-pfl']);
// 1993 mergers: the source carries the former PDC/PTR labels beyond their
// mergers. Preserve only a documented reclassification of the legacy proxies.
for(const y of [1993,1994]) {
  const pdc=snapshots[y].rows.find(r=>r.id==='PDC');const ppr=row(y,'PP','PPR');
  if(pdc) for(const k of shares) ppr[k]=(ppr[k]??0)+(pdc[k]??0);
  snapshots[y].rows=snapshots[y].rows.filter(r=>r.id!=='PDC');
  const ptr=snapshots[y].rows.find(r=>r.id==='PTR');
  if(ptr) {ptr.id='PP (1993)';ptr.name='PP (1993)';}
}
note([1993,1994],
  'As estimativas herdadas do PDC foram reunidas ao PDS/PPR após a fusão de junho de 1993. O registro herdado do PTR foi identificado com o PP de 1993, criado com o PST. São reclassificações de estimativas eleitorais, não novas contagens de filiados.',
  'Legacy PDC estimates are grouped with PDS/PPR after the June 1993 merger. The inherited PTR record is identified with the separate 1993 PP formed with PST. These are reclassified electoral estimates, not newly verified affiliation counts.',
  ['tse-history']);
// PPB was formed only in November 1995: July cannot use a merged party.
snapshots[1995].rows.find(r=>r.id==='PP').name='PPR';
row(1995,'PP (1993)','PP (1993)');
for(const id of ['PP','PP (1993)']) for(const k of shares) row(1995,id)[k]=null;
note([1995],
  'O PPB surgiu em novembro de 1995. No recorte de julho, PPR e PP de 1993 aparecem separados; a base antiga já os fundia, por isso suas parcelas não podem ser recuperadas com segurança.',
  'PPB was formed in November 1995. PPR and the 1993 PP are separate in the July profile; their shares cannot safely be recovered from the already-merged legacy inputs.',
  ['tse-history']);
// Current-party affiliation and election entitlement are different datasets.
for(const y of input.years.filter(y=>y>=2019)) for(const r of snapshots[y].rows) r.senateShare=null;
note(input.years.filter(y=>y>=2019),
  'As antigas parcelas do Senado não acompanhavam filiações, suplências e federações; por exemplo, mantinham cinco senadores na Rede. O componente do Senado de 2019–2026 foi retirado do cálculo até ser reconstruído com listas datadas.',
  'The old Senate shares did not track affiliations, substitutes and federations; for example, they kept five senators in Rede. The 2019–2026 Senate-share component is withheld until dated rosters can reconstruct it.',
  ['senado-rede','senado-randolfe','tse-representation']);
snapshots[2022].rows=snapshots[2022].rows.filter(r=>!['DEM','PSL'].includes(r.id));
row(2022,'UNIÃO','União Brasil');
for(const r of snapshots[2022].rows) r.governorShare=null;
note([2022],
  'DEM e PSL deixaram de existir com a aprovação da União Brasil em 8 de fevereiro de 2022. Suas linhas foram removidas do recorte de julho. As parcelas estaduais que a base ainda atribuía a ambos foram retiradas, sem transferir automaticamente filiações não verificadas.',
  'DEM and PSL ceased to exist when União Brasil was approved on 8 February 2022. Their rows are removed from the July profile. Stale governor allocations are withheld rather than automatically transferring unverified affiliations.',
  ['tse-uniao']);
snapshots[2016].offices.speaker='PP';
note([2016],
  'Em 1º de julho de 2016, as funções de presidente da Câmara eram exercidas por Waldir Maranhão (PP), com Eduardo Cunha suspenso. O componente foi atribuído ao partido de quem exercia as funções.',
  'On 1 July 2016, Waldir Maranhão (PP) exercised the Chamber presidency while Eduardo Cunha was suspended. This component follows the party of the acting officeholder.',
  ['camara-waldir','camara-cunha']);
// Missing inputs acknowledged by the original reference are not carried as
// observed governor distributions through the following election interval.
const missingGovernorYears=input.years.filter(y=>y>=1955&&y<=1965);
for(const y of missingGovernorYears) for(const r of snapshots[y].rows) r.governorShare=null;
note(missingGovernorYears,
  'O arquivo de origem declara ausência das eleições estaduais de 1955, 1960 e 1965. As parcelas de governos estaduais de 1955–1965 foram retiradas; ausência de dados não significa ausência de poder.',
  'The source file explicitly lacks the 1955, 1960 and 1965 state elections. Governor shares for 1955–1965 are withheld; missing data do not mean no power.');
// The early Senate values duplicate Chamber proportions, not Senate rosters.
for(const y of input.years.filter(y=>y<1995)) for(const r of snapshots[y].rows) r.senateShare=null;
note(input.years.filter(y=>y<1995),
  'O componente do Senado de 1947–1994 copiava proporções da Câmara. Foi retirado: duas Casas diferentes não podem ser tratadas como a mesma distribuição. Os 14 pontos ficam sem atribuição.',
  'The 1947–1994 Senate component copied Chamber proportions. It is withdrawn: two different houses cannot be treated as the same distribution. Its 14 points remain unassigned.');
// TSE resolution 18.052 rejected the PRS registration in April 1992.
for(const y of [1992,1993,1994]) snapshots[y].rows=snapshots[y].rows.filter(r=>r.id!=='PRS');
note([1992,1993,1994],
  'O PRS teve o registro definitivo indeferido em 23/4/1992. Foram retiradas suas atribuições posteriores, sem inventar o destino das filiações dos antigos membros.',
  'PRS was refused definitive registration on 23 April 1992. Later allocations are removed without inventing the subsequent affiliations of its former members.',['tse-history']);
snapshots[1947].rows.find(r=>r.id==='PST (1946)').name='PPB (1946)';
note([1947],
  'Em 1º de julho, o futuro PST ainda se chamava Partido Proletário do Brasil (PPB). A mudança de nome foi aprovada em 24/7/1947.',
  'On 1 July, the future PST was still called Partido Proletário do Brasil (PPB). The name change was approved on 24 July 1947.',['tse-history']);
// Recent election-era governor allocations cannot establish July affiliations.
for(const y of [2025,2026]) for(const r of snapshots[y].rows) r.governorShare=null;
note([2025,2026],
  'As parcelas estaduais repetidas da eleição anterior foram retiradas nestes anos: não comprovam filiações, afastamentos e sucessões em 1º de julho. É necessária uma lista nominal datada.',
  'Governor shares carried forward from the previous election are withheld for these years: they do not establish affiliations, departures and successions on 1 July. A dated roster is required.');
// Raw values are rounded equivalents. When totals exceed 100% by at most
// 0.1 percentage point, reconcile that rounding explicitly and record it.
for(const y of input.years) {
  const s=snapshots[y];
  for(const id of Object.values(s.offices)) if(id!==null) row(y,id);
  for(const key of shares) {
    const total=s.rows.reduce((n,r)=>n+(r[key]??0),0);
    if(total>1+1e-9) {
      if(total>1.001) throw new Error('Material excess in '+y+' '+key+': '+total);
      for(const r of s.rows) if(r[key]!==null) r[key]/=total;
      s.notes.pt.push('Um excesso de arredondamento inferior a 0,1 ponto percentual foi conciliado proporcionalmente em '+({chamberShare:'Câmara',governorShare:'governos estaduais',senateShare:'Senado'}[key])+'.');
      s.notes.en.push('A rounding excess below 0.1 percentage point was proportionally reconciled in '+({chamberShare:'Chamber',governorShare:'governors',senateShare:'Senate'}[key])+'.');
    }
  }
}
note([2026],
  'O ano de 2026 não é uma apuração eleitoral nem uma série em tempo real. Os cargos seguem o recorte anual do arquivo de origem; as parcelas herdadas não constituem uma verificação completa de filiações em 2026.',
  '2026 is not an election result or a live feed. Offices follow the annual profile in the supplied reference; inherited shares are not a complete verification of 2026 affiliations.');
const partyMap=new Map();
for(const y of input.years) for(const r of snapshots[y].rows) {
  if(!partyMap.has(r.id)) partyMap.set(r.id,{id:r.id,label:r.name,lineage:bi(r.id,r.id),first:y,last:y});
  const p=partyMap.get(r.id);p.last=y;p.label=r.name;
}
const lineage = {
  PP:bi('Linha organizacional Arena → PDS → PPR → PPB → PP; inclui fusões, não uma ideologia imutável.','Organizational line ARENA → PDS → PPR → PPB → PP; includes mergers, not an unchanging ideology.'),
  MDB:bi('Linha MDB → PMDB → MDB.','MDB → PMDB → MDB organizational line.'),
  DEM:bi('Linha PFL → DEM; extinta na fusão com o PSL em 2022.','PFL → DEM line; ended in the 2022 merger with PSL.'),
  PODE:bi('PTN da década de 1990 → Podemos; distinto do PTN de 1945.','1990s PTN → Podemos; separate from the 1945 PTN.'),
  'PTN (1945)':bi('Partido Trabalhista Nacional histórico, separado do atual Podemos.','Historical Partido Trabalhista Nacional, separate from modern Podemos.'),
  'PSB (1947)':bi('PSB anterior à extinção dos partidos em 1965.','PSB before parties were abolished in 1965.'),
  'PDC (1945)':bi('PDC anterior à extinção dos partidos em 1965.','PDC before parties were abolished in 1965.'),
  'PST (1946)':bi('PST histórico; distinto do PST surgido no fim da década de 1980.','Historical PST; separate from the PST established in the late 1980s.'),
  'PP (1979)':bi('Partido Popular, criado em dezembro de 1979 e incorporado ao PMDB em 1982.','Partido Popular, created in December 1979 and absorbed into PMDB in 1982.'),
  'PP (1993)':bi('Partido Progressista formado por PST e PTR em 1993; fundiu-se com o PPR em 1995.','Partido Progressista formed by PST and PTR in 1993; merged with PPR in 1995.'),
  PL:bi('Linha PL → PR → PL, incluindo a fusão com o Prona.','PL → PR → PL line, including the merger with Prona.'),
  REPUBLICANOS:bi('Linha PRB → Republicanos.','PRB → Republicanos line.'),
  CIDADANIA:bi('Linha PPS → Cidadania, sem retroagir o nome PPS à década de 1940.','PPS → Cidadania line, without applying the PPS name to the 1940s.')
};
for(const p of partyMap.values()) {
  if(lineage[p.id]) p.lineage=lineage[p.id];
  if(/\(19\d\d\)/.test(p.id)) p.label=p.id;
}
const data={
  meta:{version:'2.0.0',reviewedAt:'2026-10-25',legacySourceSha256:input.source.sha256,
    weights:{president:15,speaker:8,senatePresident:7,governorShare:20,senateShare:14,chamberShare:36},
    snapshotConvention:bi('Cargos nacionais em exercício em 1º de julho; parcelas legislativas e estaduais são estimativas herdadas, não listas verificadas nessa data.','National offices exercised on 1 July; legislative and state shares are inherited estimates, not verified rosters for that date.'),
    notes:{pt:[
      'Modelo exploratório: os pontos somam componentes documentados ou estimados; não são uma medida observada de todo o poder político.',
      'Câmara: proporções derivadas de listas com suplentes até 2002 e de registros de votação desde 2003. Essas proxies não são contagens físicas de cadeiras.',
      'Governos estaduais e Senado: proporções herdadas do arquivo de referência. Valores conhecidos como inválidos foram retirados; as demais estimativas ainda não são uma reconstrução integral de filiações.',
      'Os valores nulos são indisponíveis. O restante de cada componente fica sem atribuição; não é redistribuído aos partidos mostrados.',
      'Probabilidades e intervalos da simulação anterior foram removidos porque o código gerador e os dados brutos não estavam disponíveis.',
      'As primeiras e últimas datas do catálogo indicam aparição nesta base, não datas legais de fundação ou extinção.'
    ],en:[
      'Exploratory model: points add documented or estimated components; they are not an observed measure of all political power.',
      'Chamber: shares derived from lists including substitutes through 2002 and voting records from 2003. These proxies are not physical seat counts.',
      'Governors and Senate: shares inherited from the supplied reference. Known-invalid values are withdrawn; the other estimates are still not a complete reconstruction of affiliations.',
      'Null values are unavailable. The remainder of each component stays unassigned; it is not redistributed among shown parties.',
      'Probabilities and intervals from the previous simulation are removed because its generator and raw data were unavailable.',
      'The catalogue’s first and last dates indicate appearance in these inputs, not legal foundation or dissolution dates.'
    ]}},
  years:input.years,parties:[...partyMap.values()],snapshots,sources,corrections
};
// Cross-file and accounting invariants: deliberately fail instead of silently
// filling missing shares or changing the inclusion threshold.
for(const y of data.years) {
  const s=data.snapshots[y],ids=new Set();
  for(const r of s.rows) {
    if(ids.has(r.id)) throw new Error('Duplicate '+y+' '+r.id);ids.add(r.id);
    for(const k of shares) if(r[k]!==null&&(!Number.isFinite(r[k])||r[k]<0||r[k]>1)) throw new Error('Invalid '+y+' '+k);
  }
  for(const k of shares) if(s.rows.reduce((a,r)=>a+(r[k]??0),0)>1+1e-9) throw new Error('Share total over 1');
  for(const id of Object.values(s.offices)) if(id!==null&&!ids.has(id)) throw new Error('Missing office party');
}
if(data.snapshots[1979].rows.some(r=>r.id==='PP (1979)')||data.snapshots[1982].rows.some(r=>r.id==='PP (1979)')) throw new Error('PP dates regressed');
if(data.snapshots[2022].rows.some(r=>['DEM','PSL'].includes(r.id))) throw new Error('Merger regressed');
if(data.snapshots[2016].offices.speaker!=='PP') throw new Error('Acting speaker regressed');
fs.mkdirSync(path.join(root,'docs'),{recursive:true});
fs.writeFileSync(path.join(root,'docs','data.json'),JSON.stringify(data,null,2)+'\n');
console.log('Built '+data.years.length+' years, '+data.parties.length+' party lines, '+data.corrections.length+' documented correction groups.');
