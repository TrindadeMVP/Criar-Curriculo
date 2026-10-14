from pathlib import Path
from playwright.sync_api import sync_playwright
from pypdf import PdfReader
r=Path(__file__).resolve().parents[1]
w=r/'web'
s=(w/'index.html').read_text()
s=s.replace('<link rel="stylesheet" href="./ideal-ui.css">','<style>'+(w/'ideal-ui.css').read_text()+'</style>')
s=s.replace('<script src="./ideal-ui.js"></script>','<script>'+(w/'ideal-ui.js').read_text()+'</script>')
s=s.replace('<script src="./vendor/jspdf.umd.min.js"></script>','<script>'+(w/'vendor/jspdf.umd.min.js').read_text()+'</script>')
s=s.replace('<script src="./municipios.js"></script>','').replace('<script src="./cbo.js"></script>','')
files=r/'tests'/'pdf_output';files.mkdir(exist_ok=True)
models=['classico','moderno','ats','executivo','primeiro','aprendiz','estagio','ti','criativo','elegante','minimal','corporativo','pb','duas','compacto']
passed=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None,args=['--no-sandbox'])
 for m in models:
  ctx=b.new_context(viewport={'width':1366,'height':900},accept_downloads=True)
  pg=ctx.new_page();errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.evaluate('''() => {const db={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>db[k]??null,setItem:(k,v)=>{db[k]=v}}})}''')
  pg.set_content(s,wait_until='domcontentloaded')
  pg.evaluate('''() => {Object.assign(S,{nome:"Rafael Pessoa de Teste",tel:"(19) 99999-1234",email:"pessoa.exemplo@gmail.com",cidade:"Campinas, SP",cargo:"Auxiliar de produção",resumo:"Busco oportunidades profissionais em que possa aplicar meus conhecimentos e continuar aprendendo.",exp:"Sim",jobs:Array.from({length:5},(_,i)=>({empresa:"Empresa Exemplo "+(i+1),cargo:"Empacotador",ini:"2022-01",fim:"2023-12",atual:false,desc:"Atendimento e organização de mercadorias.\\nConferência e apoio às equipes."})),esc:"Ensino Médio completo",inst:"Escola Exemplo",concl:"2023",temCursos:"Sim",cursos:[{nome:"Informática",inst:"Instituto Exemplo",ano:"2025",status:"Concluído"}],pick:["Organização","Trabalho em equipe","Pontualidade"]});S.tpl="'''+m+'''";S.step=8;renderForm();renderCV();}''')
  assert pg.evaluate('checks().every(x=>x[1])'),pg.evaluate('checks()')
  try:
   with pg.expect_download(timeout=9000) as dl:pg.locator('#pdf').click()
   path=files/f'{m}.pdf';dl.value.save_as(path)
   pdf=PdfReader(path);txt=' '.join(' '.join((p.extract_text() or '').split()) for p in pdf.pages)
   assert 'Rafael Pessoa de Teste' in txt,(m,txt[:150])
   assert 'Empresa Exemplo 1' in txt and 'Empresa Exemplo 5' in txt,(m,txt[-150:])
   assert len(pdf.pages)>=1 and not errors
   passed.append((m,len(pdf.pages),path.stat().st_size))
  except Exception as e:
   print('FALHA',m,str(e),'NOTA',pg.locator('#note').inner_text());raise
  finally:ctx.close()
 b.close()
print('APROVADOS',len(passed),'PDFs jsPDF:')
for a in passed:print('✓',*a)