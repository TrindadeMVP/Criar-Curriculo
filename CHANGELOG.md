# 1.3.2
- Edição Windows portátil compilável usando Go, sem dependências de Electron (abre navegador).
- GitHub Actions: novo job de EXE portátil e reutilização do mesmo pacote offline jsPDF/IBGE/CBO por Windows, Android e portátil.
- Importação oficial de municípios agora obrigatória já na verificação; evita chamadas repetidas e discrepâncias entre os instaladores.
- Comandos de build separados da etapa `npm run assets` para builds reprodutíveis.

## 1.3.1 (revisão de preparação para build)
- Corrigida referência desatualizada ao comando `npm run prepare` no aplicativo e nos arquivos de ajuda: use `npm run assets`.
- Teste direto do PDF no GitHub Actions passa a ser obrigatório: não publicar instaladores caso falhe.
- **Sem alegação de build executado:** EXE/APK e teste PDF direto requerem runner com dependências e execução do workflow.

# Changelog
## 1.3.0
- Workflow: job de verificação (sintaxe, testes unitários, teste no Chromium) antes dos builds; Windows e Android com verificação do conteúdo dos pacotes, `apksigner verify`, versão do APK automática, publicação em Release por tag; `--publish never`.
- Corrigido: o script `prepare` rodava automaticamente em todo `npm install`; renomeado para `assets`. Corrigido `node --test tests/` (não funciona no Node 22).
- Importador automatizado do IBGE (4 tentativas, cópia local de segurança, falha clara quando exigido).
- Importador e busca da CBO (CSV oficial ou JSON, UTF-8/Windows-1252, índice em memória, busca por palavras parciais e sem acento); importação da CBO também pela tela; campo livre preservado.
- Política de segurança de conteúdo (CSP) no app; sem recursos externos; Electron com instância única e permissões negadas.
- Instalador Windows em português, nome de arquivo estável; jsPDF só como dependência de build (instalador menor).
## 1.2.0
- Fontes externas removidas; verificador de HTML; teste E2E.
