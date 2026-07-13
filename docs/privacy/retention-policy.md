# Politica de Retencao de Dados

Ultima atualizacao: 13 de julho de 2026.

Esta politica define por quanto tempo o OrganizaGrana mantem dados pessoais e
financeiros tratados pela aplicacao. Ela e uma referencia tecnica e operacional
para o projeto e deve ser revisada antes de uso publico.

## Principios

- Manter dados somente enquanto forem necessarios para prestar o servico,
  cumprir obrigacoes aplicaveis, atender solicitacoes do titular ou preservar
  seguranca operacional.
- Permitir que o usuario exporte seus dados antes de limpeza ou exclusao.
- Remover dados financeiros do banco da aplicacao quando o usuario solicitar
  limpeza financeira.
- Remover conta, sessoes e registros associados quando o usuario solicitar
  exclusao completa da conta.
- Nao manter backups JSON no servidor da aplicacao; arquivos exportados ficam
  sob controle do proprio usuario.

## Categorias e Prazos

| Categoria | Exemplos | Retencao padrao | Evento de exclusao |
| --- | --- | --- | --- |
| Conta de autenticacao | email, identificador do usuario, metadados tecnicos de Auth | Enquanto a conta existir | Exclusao completa da conta |
| Sessoes e eventos de autenticacao | tokens, refresh tokens, eventos de login, logs do provedor | Conforme configuracao e retencao do Supabase | Revogacao de sessoes na exclusao da conta, respeitando limites do provedor |
| Perfil de uso | moeda, mes ativo, tema, nome de exibicao quando preenchido | Enquanto a conta existir | Exclusao completa da conta |
| Dados financeiros | orcamentos, categorias, despesas, datas, descricoes, snapshots, instituicoes e observacoes | Enquanto a conta existir ou ate limpeza financeira | Limpeza financeira ou exclusao completa da conta |
| Preferencias visuais | cores e preferencias de categorias | Enquanto a conta existir ou ate limpeza financeira | Limpeza financeira ou exclusao completa da conta |
| Backups JSON exportados | arquivo baixado pelo usuario com dados exportaveis | Nao armazenado pelo app apos o download | Controle exclusivo do usuario sobre o arquivo baixado |
| Logs de aplicacao e hospedagem | logs tecnicos de Netlify, Supabase e Edge Functions | Conforme retencao configurada nos provedores | Expiracao automatica do provedor ou solicitacao operacional quando aplicavel |

## Limpeza Financeira

A limpeza financeira remove dados de negocio associados ao usuario, mantendo a
conta ativa. Ela abrange:

- despesas;
- categorias de orcamento;
- orcamentos mensais;
- itens de balanco;
- snapshots de balanco;
- preferencias visuais.

A limpeza financeira nao remove a conta de autenticacao, email, perfil de uso ou
sessoes ativas.

## Exclusao Completa da Conta

A exclusao completa da conta deve ser executada por operacao server-side segura,
sem expor chaves secretas no frontend. O fluxo esperado e:

1. Validar a sessao autenticada do usuario.
2. Revogar sessoes ativas.
3. Remover registros associados ao `user_id` nas tabelas da aplicacao.
4. Remover o usuario no Supabase Auth.
5. Limpar estado local da aplicacao e redirecionar para o login.

Depois da exclusao completa, dados ainda podem persistir temporariamente em logs,
backups internos ou trilhas tecnicas dos provedores, conforme politicas e prazos
operacionais desses subprocessadores.

## Backups e Exportacoes

O app permite exportar dados em JSON para portabilidade e copia pessoal. O app
nao deve manter copia desse arquivo depois de iniciar o download no navegador.
A guarda, compartilhamento e exclusao do arquivo exportado passam a ser
responsabilidade do usuario.

## Logs e Eventos Tecnicos

Logs de Supabase, Netlify, Edge Functions e outros provedores podem conter
metadados tecnicos, como data/hora, status de requisicao, identificadores de
usuario ou mensagens de erro. Esses logs devem ser mantidos pelo menor prazo
operacional possivel e revisados conforme configuracoes disponiveis nos
provedores.

## Revisao

Esta politica deve ser revisada quando houver:

- novo subprocessador;
- nova categoria de dado pessoal;
- mudanca em autenticacao, logs ou backups;
- publicacao do app para terceiros;
- alteracao em configuracoes de retencao do Supabase ou Netlify.
