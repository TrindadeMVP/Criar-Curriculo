# Gerador de Currículos 1.3.2 — navegador, Windows e Android

Aplicativo em português do Brasil (9 etapas, 15 modelos, prévia em tempo real, PDF e Word, vários currículos, histórico, modo claro/escuro). Os dados ficam no aparelho.

- **Usar agora:** abra `web/index.html` no Chrome ou Edge.
- **Gerar o .exe e o .apk:** veja **DISTRIBUICAO.md** (publicar no GitHub, rodar o workflow, baixar os artefatos, lançar novas versões).
- **Situação real:** o fluxo do GitHub Actions, o `.exe` e o `.apk` **ainda não foram executados/comprovados**; veja `RELATORIO_TESTES.md` para o que foi testado e o que depende do GitHub.

## Pastas
`web/` aplicativo (HTML único + `vendor/`, `municipios.js`, `cbo.js`) · `electron/` projeto Windows · `capacitor.config.json` projeto Android (a pasta `android/` é gerada no build) · `scripts/` importadores IBGE/CBO, preparação e verificação · `data/` cópia do IBGE e arquivos da CBO · `tests/` testes · `original/` HTML original preservado (não apagar) · `.github/workflows/build.yml`.

## Funcionamento offline
Word (JSZip embutido) e todas as telas funcionam sem internet. O PDF direto usa o jsPDF incorporado no build (`npm run assets`); sem ele, usa a impressão do navegador. Fontes do sistema (sem Google Fonts). Currículos e histórico ficam em `localStorage`; use *Exportar dados* para backup e para trocar de aparelho.

Mudanças da versão: veja CHANGELOG.md.

## Alternativa Windows portátil
`npm run build:portable` compila um executável Windows 64 bits com Go. Abre uma interface no navegador padrão, servida por `127.0.0.1:47321`, e funciona sem Node/Electron. **Não confundir com o instalador Electron**. Veja `portable/windows/README.md`.
