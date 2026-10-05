# Estoque LCE-04 — atalho para celular

Página pública mínima que dá ao **Estoque LCE-04** um ícone próprio na tela inicial do celular.
Endereço: https://willansilva-bot.github.io/estoque-lce04/

## O que esta página faz

1. Mostra o ícone e as instruções de instalação.
2. Abre o sistema real, que roda no Google Apps Script com login da conta Google da empresa.

Ela **não tem** dados do estoque, usuários, regras de negócio, chaves, senhas ou tokens, e não chama
nenhuma API. Todo acesso, permissão e registro é decidido pelo servidor do sistema.

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Tela do atalho: instruções, “Abrir o sistema”, aviso de sem conexão |
| `manifest.webmanifest` | Nome, ícones e modo de abertura (Android/desktop) |
| `sw.js` | Service worker: guarda só os arquivos desta página (versão em `VERSAO`) |
| `icone-*.png`, `apple-touch-icon-180.png`, `favicon-*.png` | Ícones |

## Comportamento

| Situação | Resultado |
|---|---|
| Primeira visita no navegador, ou link com `?instalar` | Mostra as instruções (sem redirecionar) |
| Ícone instalado (Android) ou `?abrir` | Abre o sistema direto |
| Ícone na tela de início (iPhone) | Abre no Safari e vai direto ao sistema |
| Sem internet | Mostra “Sem conexão”; nada é registrado |

- **Android:** instala como aplicativo (sem a barra do Chrome). Ao chegar no sistema, que fica em outro
  domínio (script.google.com), o Chrome mostra uma faixa fina com o endereço do Google: é o comportamento
  esperado de um app que abre um site externo.
- **iPhone:** o atalho abre no Safari de propósito. No modo tela cheia do iOS o login Google fica em um
  armazenamento separado e costuma se perder.

## Segurança

- CSP: `default-src 'none'`; só o script desta página (por hash), imagens e manifest do próprio site.
- Nenhum cookie, `localStorage` só guarda um marcador “já vi as instruções”.
- O service worker ignora qualquer requisição de outro domínio e não guarda respostas do sistema.

## Publicar uma alteração

1. Edite os arquivos e, se mudou o script de `index.html`, recalcule o `sha256` na meta CSP.
2. Em `sw.js`, aumente `VERSAO` (ex.: `lce04-atalho-v3`) para os celulares pegarem a versão nova.
3. Commit na branch `main`. O GitHub Pages publica em **Settings › Pages › Deploy from a branch › main / (root)**.
