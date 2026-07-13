# Plano de Resposta a Incidentes de Seguranca

Ultima atualizacao: 13 de julho de 2026.

Este plano define como o OrganizaGrana deve responder a incidentes de seguranca
envolvendo dados pessoais ou financeiros. Ele e uma referencia operacional e
deve ser validado juridicamente antes de uso publico.

## Objetivos

- Proteger titulares e reduzir impacto sobre dados pessoais.
- Conter acesso indevido o mais rapido possivel.
- Preservar evidencias tecnicas para investigacao.
- Avaliar necessidade de comunicacao a titulares, ANPD e subprocessadores.
- Corrigir causa raiz e registrar aprendizados.

## Escopo

Incidentes cobertos por este plano incluem, entre outros:

- acesso indevido a conta de usuario;
- exposicao de chave secreta, service role ou credencial de deploy;
- falha de RLS, policy ou permissao que exponha dados entre usuarios;
- vazamento ou perda de backup JSON;
- alteracao, exclusao ou corrupcao nao autorizada de dados financeiros;
- uso indevido de logs com dados pessoais;
- comprometimento de Supabase, Netlify, repositorio ou ambiente local.

## Severidade

| Nivel | Criterio | Exemplos |
| --- | --- | --- |
| Baixa | Sem indicio de dados pessoais acessados ou alterados | erro operacional sem exposicao, tentativa bloqueada |
| Media | Possivel exposicao limitada ou falha reversivel | dados de um usuario potencialmente acessados, token individual comprometido |
| Alta | Exposicao, alteracao ou exclusao confirmada de dados pessoais | falha de RLS, conta comprometida, backup compartilhado indevidamente |
| Critica | Exposicao ampla, chave privilegiada comprometida ou impacto multiusuario | service role exposta, acesso amplo ao banco, vazamento publico |

## Papeis

- Responsavel tecnico: conduz contencao, investigacao e correcao.
- Responsavel LGPD/controlador: avalia comunicacao ao titular e a ANPD.
- Subprocessadores: Supabase e Netlify devem ser acionados quando o incidente
  envolver seus servicos, logs ou credenciais.
- Canal de atendimento: `privacidade@organizagrana.app`.

## Fluxo de Resposta

### 1. Identificacao

Registrar imediatamente:

- data e hora de deteccao;
- fonte do alerta ou relato;
- sistemas afetados;
- usuarios potencialmente afetados;
- tipo de dado envolvido;
- evidencias iniciais, sem apagar logs.

### 2. Contencao

Executar apenas acoes proporcionais ao risco:

- revogar credenciais expostas;
- rotacionar chaves Supabase, Netlify ou variaveis de ambiente;
- pausar deploy ou feature afetada;
- desabilitar temporariamente Edge Function, rota ou fluxo vulneravel;
- corrigir ou restringir policies RLS e grants;
- encerrar sessoes comprometidas quando aplicavel.

Nunca executar comandos destrutivos antes de preservar evidencias minimas,
exceto quando necessario para impedir dano em andamento.

### 3. Investigacao

Verificar:

- commits recentes, migrations, policies RLS e grants;
- logs do Supabase Auth, PostgREST, Edge Functions e banco;
- logs de deploy e acesso da Netlify;
- variaveis de ambiente e historico de rotacao;
- dados consultados, alterados ou removidos;
- se o incidente afeta um usuario, varios usuarios ou todos.

### 4. Erradicacao e Recuperacao

- corrigir causa raiz;
- revisar tests ou checks de seguranca quando aplicavel;
- restaurar dados apenas de fonte confiavel;
- validar RLS e permissoes com usuario autenticado e usuario nao autorizado;
- monitorar logs apos a correcao;
- documentar o horario de normalizacao.

### 5. Comunicacao

Avaliar comunicacao quando houver risco ou dano relevante aos titulares.

A comunicacao deve incluir, quando aplicavel:

- natureza do incidente;
- categorias de dados afetadas;
- titulares afetados ou potencialmente afetados;
- medidas tecnicas e administrativas adotadas;
- riscos relacionados ao incidente;
- medidas que o titular pode tomar;
- canal de contato para duvidas.

O responsavel LGPD/controlador deve decidir se ha necessidade de comunicacao a
ANPD e titulares, considerando risco, dano relevante, escopo e orientacao legal.

### 6. Pos-incidente

Em ate 5 dias uteis apos contencao:

- registrar linha do tempo;
- registrar causa raiz;
- listar dados e usuarios afetados;
- registrar decisoes de comunicacao;
- criar tarefas corretivas;
- atualizar documentacao, politica ou controles;
- revisar se o incidente exige mudanca de arquitetura.

## Checklist Supabase

- Confirmar que `service_role` ou secret keys nao estao no frontend, repo ou logs.
- Revisar grants para `anon` e `authenticated`.
- Revisar RLS em tabelas expostas do schema `public`.
- Validar que policies usam `TO authenticated` com predicado de ownership.
- Verificar Edge Functions com `verify_jwt` quando dependem de usuario autenticado.
- Rotacionar chaves se houver suspeita de exposicao.
- Revisar logs de Auth e banco para usuarios afetados.

## Checklist Netlify

- Revisar variaveis de ambiente configuradas no projeto.
- Rotacionar tokens de deploy se houver exposicao.
- Revisar historico de deploy e branch publicada.
- Confirmar que arquivos sensiveis nao foram publicados em `dist`.
- Revisar logs de build quando houver suspeita de vazamento de segredo.

## Registro Minimo de Incidente

Cada incidente deve gerar um registro interno com:

- identificador do incidente;
- data/hora de deteccao;
- data/hora de contencao;
- severidade;
- resumo;
- sistemas afetados;
- dados afetados;
- usuarios afetados;
- evidencias preservadas;
- acoes tomadas;
- decisao de comunicacao;
- tarefas de prevencao.

## Revisao do Plano

Este plano deve ser revisado quando houver:

- nova integracao ou subprocessador;
- mudanca em autenticacao, RLS, Edge Functions ou deploy;
- incidente real ou simulado;
- alteracao regulatoria relevante;
- publicacao do app para terceiros.
