# Relatório da entrega 1.3.2 (ChatGPT)

## Resultado efetivo

- **Gerador-Curriculos-Windows-PORTATIL.exe**: compilado localmente com Go 1.23 (target Windows amd64). Binário PE32+ verificado, ~5,9 MB. Contém HTML e JSZip; roda como servidor local em `127.0.0.1:47321`, abre o navegador padrão. Não é o instalador nativo Electron.
- **Teste do servidor**: o mesmo fonte do Go compilado para Linux respondeu por HTTP 200 para index.html, lista de municípios, CBO e recurso neutro de jsPDF. Sem Windows nesta sessão, **não executamos o EXE no Windows**.
- **Testes de sintaxe/segurança:** `npm run check` passou.
- **Testes unitários:** `npm run test:unit` = 10/10 passaram.
- **Playwright no ambiente atual:** navegador bloqueou acesso inclusive ao endereço loopback com ERR_BLOCKED_BY_ADMINISTRATOR; não repetimos os testes 119/119 reportados anteriormente pelo Claude. Esses testes continuam no repositório.
- **GitHub Actions:** workflow YAML interpretado localmente e atualizado, porém **ainda não executado no GitHub**. O Electron EXE e o APK ainda não foram criados.

## Mudanças 1.3.2

- Edição portátil Windows com servidor HTTP estritamente local e port fixo, para manter o mesmo localStorage por execução. Abre navegador padrão, necessita manter processo aberto.
- `scripts/build-portable.mjs` copia as fontes de `web/` e compila com Go. Se não houver jsPDF, inclui um recurso neutro que evita erro 404; a exportação de PDF usa a impressão do navegador.
- Workflow: verificação gera e guarda jsPDF + IBGE + CBO uma única vez; Windows (Electron), Android (Capacitor) e Windows portátil reutilizam os mesmos arquivos, sem novo download do IBGE. Criado job Windows portátil.
- Versionamento `package.json`: 1.3.2; `npm run build:windows` e `npm run android:sync` não acionam download de arquivos novamente (faça `npm run assets` antes em builds locais).

## Pendências

1. Teste real do EXE portátil em Windows 10/11.
2. Rodar GitHub Actions pela primeira vez para obter instalador Electron `.exe` e APK Android de debug; corrigir falhas se ocorrerem.
3. Testar APK em Android e versão Electron no Windows.
4. Integrar CBO oficial (não há dados em `data/cbo/`).
5. Validar exportação PDF direta do jsPDF depois que ele for obtido e incorporado no build; uso via impressão já é alternativa.
6. A versão portátil **não traz** a base completa IBGE neste build local; o job de GitHub exigirá/baixará a base completa.

## Como proceder para os instaladores completos

Publique os arquivos do pacote-fonte no GitHub, incluindo `.github/workflows/build.yml`. Execute **Actions → Gerar APK e EXE → Run workflow**. Se passar, baixe os artefatos: `Gerador-Curriculos-Windows`, `Gerador-Curriculos-Windows-PORTATIL` e `Gerador-Curriculos-Android`.

A edição portátil local usa navegador e localStorage na origem `http://127.0.0.1:47321`, diferente da versão `file://` e do Electron. Para migrar currículos já preenchidos, use Exportar dados/Importar dados. Não há assinatura digital Windows; pode surgir aviso do SmartScreen.
