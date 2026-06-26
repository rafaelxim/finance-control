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
pnpm test:e2e
pnpm build
```

Use `pnpm format` para aplicar Prettier.

## Dados Remotos

Os dados ficam no Supabase configurado para o cliente público da aplicação. A
tela `Configurações` permite exportar, importar e limpar os dados remotos. O
backup JSON inclui orçamento, categorias, despesas, balanços, itens de balanço e
preferências visuais. Ele não inclui imagens, assets decorativos ou dados de
serviços externos.

Esta fase não usa autenticação. As políticas RLS permitem CRUD para o papel
`anon`, então qualquer pessoa com a URL e a publishable key do projeto acessa o
mesmo conjunto compartilhado de dados. Isso é intencional para a migração atual
e deve ser revisto antes de uso multiusuário ou público.

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

Esta versão é um estudo privado, sem autenticação, sincronização offline,
integrações bancárias, corretoras ou cartões. O objetivo é manter uma aplicação
pequena, auditável e fácil de evoluir.
