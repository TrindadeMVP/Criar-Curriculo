# Como publicar o repositório e gerar o instalador Windows (.exe) e o APK Android

Tudo é compilado pelo GitHub Actions, sem instalar nada no seu computador. **Este fluxo ainda não foi executado no GitHub** (o ambiente de desenvolvimento não tinha internet nem Android SDK). A primeira execução é o teste real: se algo falhar, a etapa que falhou mostra a causa em português.

## 1. Publicar o repositório
1. Crie uma conta em github.com e um repositório novo (pode ser privado), sem README.
2. Na pasta do projeto (onde está `package.json`), execute:
```sh
git init -b main
git add .
git commit -m "Gerador de Currículos 1.3.1"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```
Pelo site também funciona (arrastar os arquivos), mas é preciso enviar a pasta oculta `.github/workflows/`.

## 2. Executar o workflow
- Todo `push` na branch `main` dispara o fluxo. Para rodar manualmente: aba **Actions > Gerar APK e EXE > Run workflow**.
- Ordem: `verificar` (sintaxe, testes unitários, PDF direto e navegador) → `windows`, `windows-portatil` e `android` em paralelo. Os três recebem os mesmos recursos offline gerados na etapa de verificação. Se `verificar` falhar, nada é compilado.
- O fluxo instala sozinho Node 22, Java 21 (Temurin), Android SDK (plataforma 35 e build-tools 35.0.0), Electron e o Gradle (vem do *wrapper* do projeto Android gerado). Não é preciso configurar nada.

## 3. Baixar e instalar
Abra a execução concluída e, no fim da página, em **Artifacts**, baixe:
- **Gerador-Curriculos-Windows** (ZIP com `Gerador-Curriculos-Setup-<versão>.exe`, instalador Electron).
- **Gerador-Curriculos-Windows-PORTATIL** (ZIP com `.exe` portátil que abre o navegador local; não é Electron).
- **Gerador-Curriculos-Android** (ZIP com `Gerador-Curriculos-<versão>-debug.apk`).
Os artefatos ficam disponíveis por 30 dias.

- **Windows:** o instalador não é assinado digitalmente; o SmartScreen pode avisar. Use *Mais informações > Executar assim mesmo*.
- **Android:** copie o APK ao celular e permita "instalar apps desconhecidos" para o app usado para abri-lo. É um APK de **depuração** (assinado com chave de teste), próprio para testes; não serve para a Play Store, que exige pacote AAB assinado com chave sua (fora do escopo desta versão).

## 4. O que faz o fluxo falhar de forma clara
Após cada build, `scripts/verify-artifacts.mjs` confere: existência de exatamente 1 `.exe`/`.apk`, tamanho mínimo, cabeçalho de executável, `AndroidManifest.xml`, e a presença **dentro do pacote** de `index.html`, `vendor/jspdf.umd.min.js` (PDF offline), `cbo.js` e `municipios.js` com a lista do IBGE. O APK também passa por `apksigner verify`. As etapas de upload usam `if-no-files-found: error`.

## 5. Dados brasileiros
- **IBGE:** baixado automaticamente da API oficial a cada build (4 tentativas). Se a API falhar, usa `data/ibge/municipios.json`, se existir no repositório. Para fixar uma cópia: rode `npm install && npm run assets` uma vez e faça commit de `data/ibge/municipios.json`. Os builds exigem a lista (variável `REQUIRE_IBGE=1`), para nunca sair um instalador sem municípios.
- **CBO:** coloque os arquivos oficiais em `data/cbo/` (veja `data/cbo/LEIA-ME.md`) e faça commit. Sem arquivos, o instalador sai com as sugestões internas e o usuário pode importar a CBO pela tela "Objetivo". O formato real dos arquivos oficiais não pôde ser confirmado neste ambiente.

## 6. Nova versão
1. Altere `version` em `package.json` (ex.: `1.3.1`) e faça commit.
2. `git tag v1.3.1 && git push origin main --tags`. O job `publicar` confere se a tag é igual à versão e cria um *Release* no GitHub com o `.exe` e o `.apk` anexados.

## 7. Comandos locais
```sh
npm install
npm run assets        # jsPDF + IBGE + CBO (precisa de internet para o IBGE)
npm run check         # sintaxe, recursos externos proibidos, chaves de API
npm run test:unit     # importadores e verificador
pip install playwright pillow python-docx pypdf && python -m playwright install chromium
python3 tests/e2e.py  # teste real no navegador
npm run assets        # antes de compilar, uma vez por versão
npm run build:windows # instalador Electron em um PC Windows
npm run build:portable # EXE portátil usando Go (no Windows, Linux ou macOS)
npm run android:debug # com Android SDK + JDK 21 (na primeira vez: npm run android:init)
```
Abrir `web/index.html` direto no Chrome/Edge também funciona; o PDF usa a impressão do navegador enquanto `web/vendor/jspdf.umd.min.js` não existir.

## 8. Segurança e privacidade
Não há chaves de API nem credenciais no código (verificado por `npm run check`). O app não envia dados a servidores; a única conexão externa possível é a consulta de municípios ao IBGE quando a lista não está embutida. A correção por IA do Claude só existe dentro do ambiente Claude; nos instaladores vale a correção local.
