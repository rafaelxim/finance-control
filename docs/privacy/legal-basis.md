# Bases Legais por Operacao de Tratamento

Ultima atualizacao: 13 de julho de 2026.

Esta matriz descreve a base legal prevista para cada operacao de tratamento de
dados pessoais no OrganizaGrana. Ela e uma referencia tecnica e operacional e
deve ser validada juridicamente antes de uso publico.

## Matriz

| Operacao | Dados tratados | Finalidade | Base legal prevista |
| --- | --- | --- | --- |
| Criar conta | email, senha, identificador de usuario e metadados tecnicos de Auth | Permitir cadastro, login e protecao da conta | Execucao de contrato ou procedimentos preliminares relacionados ao servico solicitado pelo usuario |
| Autenticar usuario | email, senha, sessoes, tokens e eventos de autenticacao | Permitir acesso seguro aos dados financeiros do proprio usuario | Execucao de contrato e legitimo interesse para seguranca da aplicacao |
| Manter perfil de uso | moeda, mes ativo, tema e nome de exibicao quando preenchido | Personalizar a experiencia e carregar o contexto financeiro correto | Execucao de contrato |
| Registrar orcamentos e categorias | mes, valores, limites, nomes de categorias e observacoes | Organizar planejamento financeiro mensal | Execucao de contrato |
| Registrar despesas | valor, data, categoria, descricao e vinculo ao orcamento | Acompanhar gastos informados pelo usuario | Execucao de contrato |
| Registrar patrimonio e balanco | snapshots, itens, instituicoes, valores e observacoes | Calcular e acompanhar patrimonio informado pelo usuario | Execucao de contrato |
| Salvar preferencias visuais | cores e preferencias de categorias | Melhorar usabilidade e identificacao visual das categorias | Execucao de contrato |
| Exportar dados | payload JSON com perfil, orcamentos, despesas, balancos e preferencias | Permitir portabilidade, backup pessoal e acesso aos proprios dados | Cumprimento de direito do titular e execucao de contrato |
| Importar dados | payload JSON fornecido pelo usuario | Restaurar dados e manter continuidade do uso | Execucao de contrato |
| Limpar dados financeiros | identificadores e registros financeiros associados ao usuario | Atender solicitacao do usuario para remover dados de negocio mantendo a conta | Cumprimento de direito do titular e execucao de contrato |
| Excluir conta | conta de autenticacao, sessoes, perfil e registros associados | Atender solicitacao de exclusao e encerrar o uso do servico | Cumprimento de direito do titular |
| Manter logs tecnicos | data/hora, status de requisicao, identificadores tecnicos e mensagens de erro | Seguranca, diagnostico, auditoria operacional e prevencao de abuso | Legitimo interesse e, quando aplicavel, obrigacao legal |
| Hospedar e entregar o frontend | metadados tecnicos de acesso processados pela hospedagem | Disponibilizar a aplicacao no navegador | Execucao de contrato e legitimo interesse operacional |

## Observacoes

- Consentimento nao deve ser usado como base legal padrao para operacoes
  essenciais do app quando a operacao e necessaria para prestar o servico
  solicitado pelo usuario.
- Dados financeiros inseridos pelo usuario podem revelar aspectos sensiveis da
  vida financeira. O projeto deve aplicar minimizacao, controle de acesso e RLS
  por usuario mesmo quando a base legal principal for execucao de contrato.
- Bases legais podem mudar se o app adicionar marketing, analytics, integracoes
  bancarias, compartilhamento com terceiros ou uso secundario dos dados.
- Operacoes baseadas em legitimo interesse devem ter avaliacao documentada de
  necessidade, proporcionalidade e expectativa do titular antes de uso publico.
