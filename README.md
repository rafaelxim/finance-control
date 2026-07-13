# Finance Control

Aplicação para controle financeiro pessoal com Vue 3, TypeScript, Pinia,
Supabase Postgres/Data API e visual inspirado no arquivo `DESIGN-binance.md`.

## Requisitos

- Node.js LTS
- pnpm
- Projeto Supabase com as migrations deste repositório aplicadas
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` configurados em `.env`

## Rodando Localmente

```bash
pnpm install
pnpm dev
```

Abra a URL local exibida pelo Vite, normalmente `http://127.0.0.1:5173`.

Para semear o Supabase com o `backup.json` do repositório:

```bash
pnpm run migrate:backup
```

O script carrega `.env`, valida o payload e faz upserts idempotentes.

## Testes e Qualidade

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
```

Use `pnpm format` para aplicar Prettier.

## Deploy no Netlify

Este projeto inclui `netlify.toml` com:

- comando de build: `pnpm build`
- diretório publicado: `dist`
- Node.js: `22`
- rewrite SPA: `/*` para `/index.html`

Para criar o site e conectar o deploy automático da branch `main` pelo terminal:

```bash
npm install -g netlify-cli
netlify login
netlify init
```

Durante o `netlify init`, selecione o repositório GitHub existente e confirme
`main` como branch de produção. Depois configure as variáveis públicas usadas no
build:

```bash
netlify env:set VITE_SUPABASE_URL "https://fimprjbonudybnxbdaac.supabase.co"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "sua_publishable_key" --secret --context production deploy-preview branch-deploy
```

Para validar localmente a configuração do Netlify:

```bash
netlify build
```

Após isso, cada push na branch `main` dispara um deploy de produção.

## Dados Remotos

Os dados ficam no Supabase configurado para o cliente público da aplicação. O
frontend usa `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`; chaves
secretas ou `service_role` nao devem ser expostas no cliente.

A aplicacao usa Supabase Auth para login e cadastro. As tabelas financeiras em
`public` possuem `user_id`, RLS habilitado e politicas para que usuarios
autenticados gerenciem apenas os proprios registros. O papel `anon` nao deve ter
CRUD nas tabelas financeiras.

Dados tratados pela aplicacao:

- conta de autenticacao no Supabase Auth, incluindo email e credenciais
  gerenciadas pelo Supabase;
- perfil de uso, como moeda, mes ativo, tema e nome de exibicao quando
  preenchido;
- orcamentos mensais, categorias, limites, despesas, datas e descricoes;
- snapshots de patrimonio, itens de balanco, instituicoes e observacoes;
- preferencias visuais das categorias;
- backups JSON gerados pelo usuario para exportacao/importacao.

O backup JSON inclui perfil, orcamentos, categorias, despesas, balancos, itens de
balanco e preferencias visuais. Ele nao inclui imagens, assets decorativos ou
dados de servicos externos.

Subprocessadores e infraestrutura atualmente previstos:

- Supabase: autenticacao, banco Postgres, Data API e armazenamento dos dados da
  aplicacao;
- Netlify: build, hospedagem e entrega da aplicacao frontend.

## Privacidade e LGPD

Este projeto trata dados financeiros pessoais e deve manter documentacao e
controles compativeis com esse risco. O estado atual ja inclui autenticacao e
isolamento por RLS, mas ainda existem pendencias de produto e governanca antes
de considerar o app adequado para uso publico:

- publicar aviso/politica de privacidade com controlador, contato, finalidade,
  base legal, compartilhamentos, retencao e direitos do titular;
- disponibilizar uma area de privacidade para exportar dados, solicitar
  correcao, limpar dados financeiros e excluir a conta;
- implementar exclusao completa da conta por operacao server-side segura,
  incluindo Supabase Auth;
- documentar politica de retencao e plano de resposta a incidentes;
- manter um canal de atendimento para solicitacoes LGPD.

Veja `tasks-lgpd.md` para o checklist de adequacao em andamento e
`docs/privacy/retention-policy.md` para a politica de retencao.

## Fontes e Assets

A interface usa Inter para texto e JetBrains Mono para números e valores
financeiros. Arquivos de fonte podem ser colocados em `public/fonts/`; veja
`public/fonts/README.md`.

Este projeto não usa assets licenciados de marcas externas. Novos assets devem
ficar em `public/` quando forem públicos/estáticos, ou em `src/assets/` quando
forem empacotados pela aplicação.

## Referência Visual

`DESIGN-binance.md` é a referência de design: canvas escuro, ações primárias em
amarelo, cards financeiros densos, verde para estados positivos e vermelho para
estados negativos. A referência orienta tokens, espaçamento, hierarquia visual e
semântica financeira, sem copiar marca, nomes ou assets licenciados.

## Escopo

Esta versao e um estudo privado, sem sincronizacao offline, integracoes
bancarias, corretoras ou cartoes. O objetivo e manter uma aplicacao pequena,
auditavel e facil de evoluir antes de uso publico.
