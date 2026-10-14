# APK Android — Gerador de Currículos v1.3.2

**Status:** o APK ainda não foi compilado. Este pacote prepara uma compilação automática no GitHub Actions; a primeira execução precisa comprovar que o APK é gerado corretamente. Não forneça arquivos `.apk` simulados.

## Passo a passo

1. No GitHub, crie um repositório novo (público ou privado) e envie **todos** os arquivos e pastas deste ZIP, incluindo `.github/workflows/gerar-apk.yml`.
2. Abra **Actions** e selecione **Gerar somente APK Android**.
3. Toque em **Run workflow** e confirme. A execução usará os servidores do GitHub para instalar dependências, Android SDK e Gradle.
4. Quando terminar com sucesso, abra a execução e baixe **BAIXAR-APK-Gerador-Curriculos**, na seção **Artifacts**. Extraia o ZIP baixado: dentro estará `Gerador-Curriculos-Android-1.3.2-debug.apk`.
5. Envie o `.apk` ao celular e abra para instalar. O Android poderá pedir autorização para instalar aplicativos dessa origem.

### O que foi verificado localmente

- O código-fonte e o workflow estão incluídos no pacote.
- Os testes estáticos e unitários podem ser executados sem compilar Android.
- **Não foi possível executar Gradle nem instalar o APK neste ambiente**: o Android SDK e as dependências do npm não estão disponíveis e a rede do contêiner não resolve o registro npm.

### Observações

- O APK resultante é um **debug APK** assinado para testes, não uma versão de publicação na Play Store.
- Os recursos de PDF usam jsPDF adicionado pela etapa `npm run assets`. O Word usa JSZip já incluso no HTML.
- Se o serviço do IBGE não responder, o instalador ainda poderá ser gerado e manterá o campo de município livre. A lista completa poderá ser incorporada numa próxima versão.
- O workflow original `Gerar APK e EXE` permanece no projeto, mas este novo workflow compila **somente Android** para simplificar a primeira instalação.

Se a execução falhar, o log da primeira etapa vermelha identifica a causa real. A partir desse log, pode-se corrigir o projeto sem adivinhações.
