# Tarefas LGPD

Checklist tecnico para alinhar o projeto com praticas de conformidade LGPD.
Este arquivo nao substitui revisao juridica.

- [x] Corrigir README e documentacao de dados para refletir autenticacao, RLS por usuario, tipos de dados tratados, subprocessadores e escopo atual.
- [ ] Criar aviso/politica de privacidade e adicionar link visivel na tela de login.
- [ ] Criar secao "Privacidade e dados" em Configuracoes com exportacao, download JSON, limpeza de dados financeiros, exclusao de conta, link de politica e contato do controlador.
- [ ] Implementar exclusao completa da conta via operacao server-side segura, incluindo Supabase Auth, dados financeiros e sessoes.
- [ ] Documentar politica de retencao para dados financeiros, conta, backups, logs e eventos de autenticacao.
- [ ] Documentar base legal por operacao de tratamento.
- [ ] Disponibilizar canal de atendimento para direitos do titular.
- [ ] Documentar plano de resposta a incidentes de seguranca.
- [ ] Revisar migrations e scripts para evitar identificadores reais hardcoded em migrations genericas.
