# NutriKids — Shell PWA (GitHub Pages)

Este pacote resolve a instalação do PWA hospedando um "invólucro" simples
fora do Google Apps Script. O Apps Script sempre serve seu HTML dentro de
um iframe cujo origin real (`*.googleusercontent.com`) é diferente da URL
que aparece na barra de endereço (`script.google.com/.../exec`). Por isso o
navegador nunca considera aquela URL instalável, não importa o que seja
ajustado dentro do próprio Apps Script.

Este shell resolve isso: ele mesmo tem manifest + service worker (satisfazendo
os requisitos de instalabilidade) e exibe o NutriKids em tela cheia dentro de
um `<iframe>` apontando para o seu `.../exec`.

## Arquivos

- `index.html` — página shell, com o iframe do NutriKids, tela de carregamento e botão "Instalar app".
- `manifest.json` — manifest do shell (nome, ícones, cores, modo standalone).
- `sw.js` — Service Worker do shell, cacheia só os arquivos do próprio shell.
- `icons/icon-192.png` e `icons/icon-512.png` — ícones do app.

## Passo a passo para publicar no GitHub Pages

1. Crie um repositório novo no GitHub (pode ser público ou privado, desde
   que o GitHub Pages esteja habilitado no plano da sua conta).
2. Faça upload de **todos os arquivos deste pacote** para a raiz do
   repositório (mantendo a pasta `icons/`).
3. No repositório, vá em **Settings → Pages**.
4. Em "Build and deployment", selecione **Deploy from a branch**, escolha a
   branch `main` (ou `master`) e a pasta `/ (root)`. Salve.
5. Aguarde alguns instantes; o GitHub vai gerar uma URL do tipo
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
6. Abra essa URL no Chrome ou Edge (celular ou computador). O botão
   **"📲 Instalar app"** deve aparecer no canto inferior direito assim que
   o navegador considerar a página instalável (geralmente após o
   carregamento completo).

## Se o Apps Script mudar de URL de deployment

Basta abrir `index.html` e trocar o valor do atributo `src` do `<iframe>`
pela nova URL `.../exec`. Não é necessário mexer em mais nada.

## Observação sobre o X-Frame-Options

O `GS.gs` do NutriKids já está configurado com
`setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)`, que é o que
permite que este iframe funcione. Se essa linha for removida do backend, o
Google vai bloquear a incorporação e a tela ficará em branco.
