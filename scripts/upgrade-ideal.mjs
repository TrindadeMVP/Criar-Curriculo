import fs from 'node:fs';
import path from 'node:path';

const web = path.resolve('web');
const file = path.join(web, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const replace = (from, to, label) => {
  if (!html.includes(from)) throw new Error(`Atualização interrompida: trecho não encontrado (${label}).`);
  html = html.replace(from, to);
};
const block = (start, end, content, label) => {
  const a = html.indexOf(start), b = html.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error(`Trecho não encontrado: ${label}`);
  html = html.slice(0, a) + content + '\n' + html.slice(b);
};
if (html.includes('data-version="ideal-v140"')) {console.log('Currículo Ideal já aplicado.');process.exit(0);}

replace('<title>Gerador de Currículos</title>', '<title>Currículo Ideal</title>', 'título');
replace('<header class="top"><b>Gerador de Currículos</b>', '<header class="top" data-version="ideal-v140"><div class="brand"><img src="./ideal-icon.png" alt="" width="38" height="38"><span><b>Currículo <em>Ideal</em></b><small>Seu currículo, do seu jeito</small></span></div>', 'marca');
replace('aria-label="Alternar tema claro e escuro">Tema</button></header>', 'aria-label="Alternar tema claro e escuro">☾ Tema</button></header>', 'tema');
replace('<section class="panel"><div class="pvw"><article id="cv"', '<section class="panel preview-panel" id="previewPanel"><div class="preview-bar"><b>Prévia do currículo</b><span>Atualização automática</span></div><div class="pvw"><article id="cv"', 'prévia');
replace('<div class="bar" id="rbar">', '<div class="bar" id="rbar"><details id="manageCv"><summary>Meus currículos e versões</summary><div class="manage-content">', 'gerenciador');
replace('<span id="note" role="status"></span></div>', '<span id="note" role="status"></span></div></details></div>', 'gerenciador fim');
replace('<div class="app">', '<div class="mobile-preview"><button type="button" id="previewToggle" aria-expanded="false">Ver prévia do currículo ↓</button></div><div class="app">', 'mobile prévia');
replace('</div>\n<datalist id="cg">', '</div><footer class="app-footer"><span>Currículo Ideal · v1.4.0</span><span>Desenvolvido por <b>Lukas Trindade</b></span></footer>\n<datalist id="cg">', 'rodapé');
replace('</head>', '<link rel="stylesheet" href="./ideal-ui.css"><link rel="icon" type="image/png" href="./ideal-icon.png">\n</head>', 'CSS');
replace('</body>', '<script src="./ideal-ui.js"></script>\n</body>', 'JavaScript');

// Mantém os IDs antigos e os currículos já salvos, mas retira rótulos por profissão.
replace("['executivo','Executivo'],['primeiro','Primeiro emprego'],['aprendiz','Jovem aprendiz'],['estagio','Estágio'],['ti','Tecnologia e TI'],['criativo','Criativo elegante']", "['executivo','Executivo'],['primeiro','Destaque suave'],['aprendiz','Faixas elegantes'],['estagio','Linha lateral'],['ti','Linhas técnicas'],['criativo','Criativo elegante']", 'nomes dos modelos');
replace('PRE={primeiro:FJO,aprendiz:FJO,estagio:FJO}', 'PRE={}', 'ordem automática por profissão');
replace("${ch('pages','Limite de páginas (toque de novo para desmarcar)',['1 página','2 páginas'])}", '<p class="print-note">As páginas são organizadas automaticamente para não cortar informações.</p>', 'promessa de limite de páginas');
replace("<div class=\"q\"><b>Verificador (", "<div class=\"q\"><b>Conferência do currículo (", 'revisão');

// Correção local conservadora. Remove integração ao Claude, que não existe no APK.
block('function basicFix(t,style){', 'function checks(){', "function basicFix(t){\n const replacements=[[/\\bvc\\b/gi,'você'],[/\\btbm\\b/gi,'também'],[/\\bpra\\b/gi,'para'],[/\\btô\\b/gi,'estou'],[/\\bq\\b/gi,'que'],[/\\bexperiencia\\b/gi,'experiência'],[/\\batendimeto\\b/gi,'atendimento'],[/\\btrabaiei\\b/gi,'trabalhei'],[/\\bresponsavel\\b/gi,'responsável'],[/\\bcomunicacao\\b/gi,'comunicação'],[/\\borganisação\\b/gi,'organização']];\n return String(t).split('\\n').map(line=>{\n  let x=line.trim();if(!x)return'';\n  let prefix='';const bullet=x.match(/^([-•])\\s*/);if(bullet){prefix='- ';x=x.slice(bullet[0].length)}\n  for(const [pattern,replacement] of replacements)x=x.replace(pattern,replacement);\n  x=x.replace(/\\s+([,.;:!?])/g,'$1').replace(/([,;:])(?=\\S)/g,'$1 ').replace(/\\s{2,}/g,' ');\n  x=x.replace(/(^|[.!?]\\s+)([a-zà-ú])/g,(_,a,c)=>a+c.toUpperCase());\n  if(!/[.!?:;]$/.test(x))x+='.';\n  return prefix+x;\n }).filter(Boolean).join('\\n');\n}\nfunction fixUI(key){\n const p=FX&&FX.key===key?'<div class=\"item revision-result\"><b>Seu texto</b><p class=\"hint\" style=\"white-space:pre-wrap\">'+esc(FX.orig)+'</p><b>Sugestão de revisão</b><textarea id=\"fxt\">'+esc(FX.sug)+'</textarea><div class=\"opts\"><button type=\"button\" class=\"p\" data-fa=\"1\">Usar sugestão</button><button type=\"button\" data-fa=\"0\">Manter original</button></div><small class=\"fb\">Confira antes de aceitar: o aplicativo não cria fatos nem substitui uma revisão humana.</small></div>':'';\n return '<div class=\"text-revision\"><small>Escreva naturalmente. A revisão local ajusta pontuação e alguns erros comuns, sem enviar seus dados para IA.</small><button type=\"button\" data-fix=\"'+esc(key)+'\">Revisar meu texto</button></div>'+p;\n}\n", 'revisão local');

// Substituição direta do clique que invocava a API exclusiva do Claude.
const fromClick="else if(d.fix){const key=d.fix,src=key==='resumo'?S.resumo:S.jobs[+key.slice(3)].desc;if(!src.trim()){msg('Escreva um texto primeiro e depois toque para corrigir.');return}msg('Corrigindo...');let sg=null,eng='correção básica, sem internet';try{sg=S.aiOk?await aiFix(src,S.fxs||'simples'):null;if(sg)eng='IA do Claude'}catch(e){}if(!sg)sg=basicFix(src,S.fxs);FX={key,orig:src,sug:sg,eng};msg('');renderForm()}";
const toClick="else if(d.fix){const key=d.fix,src=key==='resumo'?S.resumo:S.jobs[+key.slice(3)].desc;if(!src.trim()){msg('Escreva um texto antes de revisar.');return}FX={key,orig:src,sug:basicFix(src),eng:'revisão no aparelho'};msg('');renderForm()}";
replace(fromClick,toClick,'botão de correção');

// O formulário não deve forçar habilidades que a pessoa não declarou.
block('function checks(){', '/* ---------- modelo de dados', String.raw`
function checks(){
 const temExperiencia=S.exp==='Sim'&&S.jobs.some(j=>j.empresa&&j.cargo);
 return [
  ['Nome e sobrenome',S.nome.trim().split(/\s+/).length>=2,'Informe nome e sobrenome.'],
  ['Pelo menos um contato',telOk()||emailOk(),'Informe um telefone com DDD ou um e-mail válido.'],
  ['Cidade e estado',!!S.cidade.trim(),'Informe onde mora.'],
  ['Experiência ou formação',temExperiencia||!!S.esc,'Selecione sua escolaridade ou informe uma experiência.'],
  ['Objetivo profissional',!!(S.cargo.trim()||S.resumo.trim()),'Descreva a vaga desejada ou seu objetivo.']
 ];
}
`, 'validador');

// Copia curso com situação correta sem inventar uma conclusão.
replace("w:c.ano,d:''", "w:c.status==='Em andamento'?(c.ano?'Previsão '+c.ano:'Em andamento'):c.status==='Não concluído'?'Não concluído':c.ano,d:''", 'situação dos cursos');

// Corrige imagens SVG no escopo local, sem a antiga solicitação de rede.
fs.writeFileSync(file, html, 'utf8');
fs.writeFileSync(path.join(web, 'ideal-ui.css'), String.raw`
:root{--bg:#f2f6fd;--panel:#fff;--ink:#162b49;--mute:#59708c;--line:#dce5f3;--accent:#176ae6;--ai:#fff;--ok:#16854d;--bad:#c63838}
:root[data-theme="dark"]{--bg:#101929;--panel:#182338;--ink:#f2f6ff;--mute:#b0bfd4;--line:#34445e;--accent:#5c9eff;--ai:#0b1730}
[hidden]{display:none!important}
#manageCv{width:100%}
#manageCv>summary{display:none}
.manage-content{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.45}
.top{background:var(--panel);padding:14px 22px;border:1px solid var(--line);border-radius:18px;margin-top:14px;align-items:center}
.top b{font-family:inherit;font-size:19px;letter-spacing:-.6px}
.top b em{color:#1875ef;font-style:normal}
.brand{display:flex;align-items:center;gap:10px;min-width:0}
.brand>span{display:grid;line-height:1.15;gap:3px}
.brand small{font-size:11px;color:var(--mute);letter-spacing:.2px}
.brand img{width:38px;height:38px;flex-shrink:0}
.prog{height:6px;background:var(--line)}
.app{gap:14px;padding-top:14px}
.panel{border-radius:16px;box-shadow:0 5px 25px rgba(18,48,98,.04);padding:18px}
h1{font-family:inherit;font-size:22px;letter-spacing:-.6px}
.hint{font-size:13px}
label{font-weight:500}
input:not([type=checkbox]):not([type=range]),textarea,select{background:var(--panel);border-radius:9px;padding:10px 11px;min-height:42px}
button{border-radius:9px;transition:background .13s ease,border-color .13s ease}
button:hover:not(:disabled){border-color:var(--accent)}
button.p{background:#176ae6;color:white;border-color:#176ae6}
button.p:hover{background:#0855cc}
.opts button{border-radius:10px;min-height:37px}
.q{margin-top:11px}
.nav{gap:4px}
.nav button{border-radius:9px;padding:9px 10px}
.nav button[aria-current="step"]{background:#176ae6;color:#fff}
.row{gap:9px}
.item{border-radius:11px;background:var(--panel);padding:10px;margin-bottom:11px}
.preview-bar{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}
.preview-bar b{font-size:14px}
.preview-bar span{color:var(--mute);font-size:11px}
.mobile-preview{display:none}
.app-footer{max-width:1320px;margin:0 auto 22px;padding:8px 22px;color:var(--mute);display:flex;justify-content:space-between;gap:12px;font-size:12px}
.app-footer b{color:var(--ink)}
.text-revision{border:1px solid var(--line);border-radius:11px;padding:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.text-revision small{flex:1;min-width:150px;color:var(--mute);font-weight:400}
.text-revision button{color:var(--accent);border-color:var(--accent)}
.print-note{font-size:12px;color:var(--mute);margin:9px 0}
.revision-result{border-color:var(--accent)}
@media(max-width:960px){.app{grid-template-columns:1fr}}
@media(max-width:600px){
 body{font-size:14px}
 .top{margin:6px 10px 0;padding:10px 12px;gap:8px;flex-wrap:wrap;border-radius:12px}
 .brand{flex:1;min-width:180px}
 .top b{font-size:17px}
 .top>button{font-size:12px;padding:7px}
 .top .prog{flex-basis:76%;order:3}
 #pct{order:4}
 .bar{margin-top:10px;padding:0 12px;gap:7px}
 #manageCv{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:9px 12px}
 #manageCv>summary{display:list-item;cursor:pointer;color:var(--ink);font-weight:600}
 .manage-content{padding-top:12px;gap:7px}
 .manage-content button{font-size:12px}
 #rbar #rname,#rbar #rsel{min-width:0;max-width:100%;flex:1 1 140px}
 .bar button{font-size:12px;padding:7px 9px}
 .mobile-preview{display:block;margin:10px 12px 0}
 .mobile-preview button{width:100%;background:var(--panel);color:var(--accent);border-color:var(--line);font-weight:600}
 .app{padding:10px 12px;gap:9px}
 .panel{padding:13px;border-radius:13px}
 .wiz{gap:10px}
 .nav{padding:4px 0;gap:5px}
 .nav button{padding:7px 11px;font-size:12px}
 .row,.row3{grid-template-columns:1fr 1fr}
 .row3 select:last-child{grid-column:1/-1}
 .app .preview-panel{display:none}
 body.preview-open .app .preview-panel{display:block}
 .preview-bar{margin-bottom:8px}
 .app-footer{padding:0 15px;flex-direction:column;align-items:center;text-align:center;gap:4px}
 .foot{position:sticky;bottom:4px;padding:8px 4px;margin-top:13px;background:var(--panel);border-top:1px solid var(--line);z-index:2}
 .foot button{min-height:42px}
 .pvw{overflow:hidden}
}
@media print{.app .preview-panel{display:block!important}.mobile-preview,.preview-bar,.app-footer{display:none!important}}
`, 'utf8');
fs.writeFileSync(path.join(web, 'ideal-ui.js'), String.raw`
(()=>{
 const manager=document.getElementById('manageCv');if(manager)manager.open=innerWidth>600;
 const button=document.getElementById('previewToggle');
 if(button)button.addEventListener('click',()=>{
  const open=document.body.classList.toggle('preview-open');
  button.textContent=open?'Ocultar prévia ↑':'Ver prévia do currículo ↓';
  button.setAttribute('aria-expanded',String(open));
  if(open){setTimeout(()=>{if(typeof renderCV==='function')renderCV();document.getElementById('previewPanel')?.scrollIntoView({behavior:'smooth',block:'start'})},30)}
 });
 document.querySelector('header.top .brand')?.addEventListener('click',()=>{if(typeof S!=='undefined'){S.step=0;renderForm();scrollTo({top:0,behavior:'smooth'})}});
})();
`, 'utf8');
fs.writeFileSync(path.join(web, 'ideal-icon.svg'), String.raw`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#51c9ff"/><stop offset=".55" stop-color="#1475ed"/><stop offset="1" stop-color="#0948c7"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#082f78" flood-opacity=".22"/></filter></defs>
<rect width="256" height="256" rx="56" fill="url(#bg)"/>
<g filter="url(#s)"><path d="M62 43h111l30 31v129c0 8-6 14-14 14H62c-9 0-15-7-15-15V59c0-9 7-16 15-16" fill="#fff"/><path d="M173 43v27a6 6 0 0 0 6 6h24" fill="#adddff"/></g>
<circle cx="87" cy="97" r="16" fill="#1375ee"/><path d="M63 130c2-26 47-26 49 0" fill="#1375ee"/>
<path d="M129 91h44M129 108h44M69 153h99M69 169h76M69 185h57" fill="none" stroke="#5b9bec" stroke-linecap="round" stroke-width="9"/>
<circle cx="191" cy="193" r="44" fill="#0875f4" stroke="#57d6ff" stroke-width="4"/>
<path d="m171 194 14 14 27-32" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`, 'utf8');
const configPath = path.resolve('capacitor.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
config.appName = 'Currículo Ideal';
// Identificador mantido para que dados anteriores possam continuar no mesmo app.
fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
const packagePath = path.resolve('package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.version = '1.4.0';
pkg.description = 'Currículo Ideal - gerador de currículos desenvolvido por Lukas Trindade';
if(pkg.build){pkg.build.productName='Currículo Ideal';pkg.build.nsis = {...pkg.build.nsis,shortcutName:'Currículo Ideal'};}
fs.writeFileSync(packagePath, JSON.stringify(pkg,null,2)+'\n','utf8');
console.log('Currículo Ideal v1.4.0 aplicado, preservando o identificador e os dados salvos.');