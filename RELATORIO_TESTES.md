# Relatório de testes — versão 1.3.0

Ambiente: container Linux sem internet, Chromium 141 (Playwright), Node 22, LibreOffice. Datas e dados de teste são fictícios.

## Comprovado (executado nesta sessão)
- `npm run check`: sintaxe de todos os scripts e dos scripts embutidos no HTML; nenhum recurso externo; nenhum padrão de chave de API.
- `npm run test:unit`: **10 de 10** testes. Importador do IBGE contra servidor **falso** local (repetição após HTTP 503, cópia local quando a API cai, falha clara quando exigido, rejeição de dados incompletos); importador da CBO com CSV **fictício** em Windows-1252, sinônimos e JSON; verificador de artefatos com APK (ZIP real) e `app.asar` **sintéticos** (aceita pacote completo; recusa ausência de EXE/APK, jsPDF, IBGE ou arquivo pequeno); ajuste de versão do Android.
- `python3 tests/e2e.py`: **119 de 119** verificações em Chromium real, via `file://`, desktop 1366×900 e celular 390×844: 9 etapas; formatação de nome/telefone; sugestão de e-mail; municípios (lista embutida); busca CBO sem acento, por palavras parciais e campo livre; 15 modelos com currículo longo e foto sem estouro lateral; 15 Word baixados, abertos no python-docx (nome, 5 experiências, foto); persistência após recarregar; exportar/importar JSON (ida e volta idêntica, arquivo inválido, tipos errados); limpar; múltiplos currículos (novo/duplicar/excluir); desfazer/refazer; versões; tema; CSP ativa sem violações; nenhuma requisição externa com internet bloqueada; importação da CBO pela tela e persistência; 15.000 títulos de CBO sintéticos: criar o índice 16 ms, pior busca 9 ms.
- Migração: um currículo gravado pela 1.2.0 e outro criado nela foram lidos corretamente pela 1.3.0 no mesmo perfil do navegador (mesma chave de armazenamento).
- `.github/workflows/build.yml`: YAML válido, com as dependências entre jobs (`verificar` → `windows`/`android` → `publicar`).

## NÃO comprovado (depende do GitHub ou de outro ambiente)
- Execução do workflow no GitHub, o `.exe` (electron-builder/NSIS) e o `.apk` (Capacitor/Gradle): nada disso foi compilado aqui. Os verificadores de pacote foram testados só com pacotes sintéticos.
- **PDF direto pelo jsPDF:** sem a biblioteca no ambiente, `tests/pdf_direto.py` sai como "PULADO". Ele roda no GitHub (passo com `continue-on-error`: falha aparece, mas não bloqueia o build).
- IBGE real (API oficial) e CBO oficial: testados só com mock/fixture fictícios; o formato real do CSV da CBO não foi confirmado.
- Word no Microsoft Word; aparência dos Word convertidos foi vista só no LibreOffice (sessão anterior).
- Persistência no Electron/Android instalados, download/compartilhamento no Android, aparência do instalador, SmartScreen.
- Desempenho em aparelho Android real.

## Problemas encontrados e corrigidos
1. `prepare` rodava a cada `npm install` (padrão do npm); renomeado para `assets`.
2. `node --test tests/` falha no Node 22; trocado por padrão de arquivos.
3. Google Fonts causava requisição externa (1.2.0); sem CSP; jsPDF empacotado como dependência de execução (inflava o instalador).
4. Busca de profissões só por trecho contíguo; agora por palavras parciais, sem acento, com limite de 12 resultados.

## Pendências conhecidas
- Primeira execução do workflow pode revelar erros de configuração não detectáveis aqui.
- CBO oficial: é preciso colocar os arquivos em `data/cbo/` (ou importar pela tela).
- Instalador Windows sem assinatura digital; APK apenas de depuração (Play Store exige AAB assinado).
- Ao importar um JSON, o app volta à etapa 1.
- Correção de texto por IA do Claude só funciona dentro do ambiente Claude; nos instaladores usa a correção local.
