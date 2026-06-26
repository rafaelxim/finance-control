# Feature Specification: Migrar Persistencia Remota

**Feature Branch**: `main`

**Created**: 2026-06-26

**Status**: Draft

**Input**: User description: "quero migrar tudo o que esta apontando do indexedDB para o supabase. sem autenticacao por enquanto. Tudo deve ser migrado inclusive os dados que estao em backup.json . Voce tem acesso ao projeto do supabase atraves do mcp supabase que ja esta configurado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Usar dados persistidos remotamente (Priority: P1)

Como usuario unico do controle financeiro, quero que todos os fluxos que hoje salvam e leem dados locais continuem funcionando com persistencia remota, para que minhas informacoes financeiras nao dependam mais apenas do armazenamento do navegador.

**Why this priority**: Sem esta troca, a aplicacao continua presa ao armazenamento local e os demais fluxos nao comprovam a migracao.

**Independent Test**: Pode ser testado criando, editando e lendo dados de orcamento, categorias, despesas e balanco apos limpar os dados locais do navegador; os dados devem continuar disponiveis ao recarregar a aplicacao.

**Acceptance Scenarios**:

1. **Given** a aplicacao aberta sem dados locais no navegador, **When** o usuario acessa dashboard, orcamento, despesas, balanco, evolucao e configuracoes, **Then** cada tela carrega os dados persistidos remotamente ou seus estados vazios existentes sem erro.
2. **Given** o usuario registra ou altera um orcamento, categoria, despesa, fechamento de balanco ou item de balanco, **When** a pagina e recarregada em seguida, **Then** a alteracao permanece visivel e consistente nos resumos, listas e graficos relacionados.
3. **Given** dados financeiros existentes no armazenamento local antigo, **When** a migracao de persistencia estiver concluida, **Then** nenhum fluxo principal depende do armazenamento local antigo para criar, listar, atualizar ou excluir registros financeiros.

---

### User Story 2 - Migrar o backup existente (Priority: P2)

Como usuario, quero que todos os dados presentes em `backup.json` sejam carregados para a nova persistencia antes de usar a aplicacao migrada, para preservar meu historico financeiro atual.

**Why this priority**: A troca de persistencia so tem valor se os dados existentes forem preservados e verificaveis.

**Independent Test**: Pode ser testado iniciando a aplicacao sem dados locais, carregando a base remota e verificando que os totais, meses, categorias, despesas e patrimonio batem com o conteudo do backup.

**Acceptance Scenarios**:

1. **Given** o arquivo `backup.json` com versao de esquema 1, 3 orcamentos mensais, 16 categorias, 7 despesas, 2 fechamentos de balanco, 6 itens de balanco, perfil ausente e preferencias visuais vazias, **When** a carga de migracao e executada, **Then** todos estes registros sao preservados com seus identificadores, referencias, valores monetarios, meses, datas e timestamps.
2. **Given** categorias, despesas e itens de balanco importados do backup, **When** o usuario navega pelos meses migrados, **Then** as relacoes entre orcamentos, categorias, despesas, snapshots e itens permanecem validas.
3. **Given** a carga ja foi executada uma vez, **When** ela for executada novamente por engano, **Then** o resultado nao duplica registros nem altera indevidamente dados ja migrados.

---

### User Story 3 - Continuar sem autenticacao (Priority: P3)

Como usuario, quero continuar usando a aplicacao sem login nesta fase, para que a migracao de persistencia nao introduza uma etapa de acesso ou gestao de usuarios.

**Why this priority**: A ausencia de autenticacao e uma restricao explicita do escopo e afeta estados de erro, permissao e experiencia de uso.

**Independent Test**: Pode ser testado abrindo a aplicacao em uma sessao nova e executando os fluxos principais sem criar conta, entrar, sair ou informar credenciais.

**Acceptance Scenarios**:

1. **Given** uma sessao nova do navegador, **When** o usuario abre qualquer rota principal da aplicacao, **Then** nenhuma tela de login, cadastro ou selecao de usuario bloqueia o uso.
2. **Given** a persistencia remota esta indisponivel, **When** o usuario tenta carregar ou salvar dados, **Then** a aplicacao exibe erro recuperavel e preserva a consistencia visual dos estados existentes.

### Edge Cases

- A carga de migracao deve rejeitar ou relatar backup invalido antes de gravar dados parciais.
- Referencias quebradas entre despesas, categorias, orcamentos, snapshots e itens de balanco devem impedir a conclusao da migracao.
- A aplicacao deve lidar com ausencia de perfil no backup usando o comportamento padrao ja existente.
- Dados remotos vazios devem manter os estados vazios atuais, sem recriar dados locais antigos automaticamente.
- Falhas de leitura ou gravacao remota devem mostrar estados de erro claros e permitir nova tentativa.
- Execucoes repetidas da migracao nao devem duplicar registros.
- Volumes ja documentados para uso pessoal historico devem permanecer responsivos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST replace all primary financial data reads and writes that currently rely on browser-local persistence with the configured remote persistence service.
- **FR-002**: System MUST preserve existing user workflows for dashboard, monthly budget, category management, expense tracking, balance snapshots, financial evolution, settings, export, and import.
- **FR-003**: System MUST migrate every valid record from `backup.json`, including monthly budgets, budget categories, expenses, balance snapshots, balance items, and visual preferences.
- **FR-004**: System MUST preserve record identifiers, timestamps, month keys, dates, monetary decimal strings, ordering, statuses, notes, and optional fields during migration.
- **FR-005**: System MUST preserve relationships between budgets and categories, expenses and categories, expenses and budgets, balance snapshots and balance items.
- **FR-006**: System MUST support the current no-authentication experience for this phase, without adding login, registration, logout, account switching, or user-specific access controls to the product flow.
- **FR-007**: System MUST expose clear loading, empty, validation, and recoverable error states for remote data operations using the product's existing UX patterns.
- **FR-008**: System MUST prevent duplicate records when the backup migration is retried with the same source data.
- **FR-009**: System MUST validate backup data before migration and report actionable errors when schema, required fields, dates, monetary values, or references are invalid.
- **FR-010**: System MUST ensure exported data after migration contains the same user-owned financial information needed for a full restore.
- **FR-011**: System MUST preserve existing terminology, navigation, validation, loading, empty, and error-state patterns for affected workflows.
- **FR-012**: System MUST meet the documented performance expectation for the primary workflows and relevant personal-use data volume.

### Key Entities

- **User Profile**: User-level preferences such as display name, currency, active month, and theme mode; may be absent in the backup and then defaults to existing behavior.
- **Monthly Budget**: A monthly financial plan with available amount, notes, status, and month identity.
- **Budget Category**: A budget allocation within a monthly budget, including name, allocation method, allocation value, computed limit, order, and status.
- **Expense**: A spending record linked to a budget and category, with amount, date, and optional description.
- **Balance Snapshot**: A monthly patrimony snapshot with optional notes.
- **Balance Item**: An asset or debt item linked to a balance snapshot, with amount, institution, notes, and order.
- **Visual Preferences**: User-owned display preferences such as category visuals.
- **Backup Payload**: Portable data package containing schema version, export timestamp, user data collections, and visual preferences.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid records in the current `backup.json` are present after migration with no duplicates.
- **SC-002**: 100% of migrated expenses, categories, budgets, balance snapshots, and balance items retain valid references after migration.
- **SC-003**: A user can complete the primary dashboard, budget, expense, balance, evolution, settings, export, and import flows without signing in.
- **SC-004**: After clearing browser-local financial data, migrated records remain visible after a full page reload.
- **SC-005**: At least 95% of normal data views for the documented personal-use history become usable within 1 second on the target browser environment.
- **SC-006**: Backup migration can be run twice against the same source data with the final record counts unchanged.
- **SC-007**: Invalid backup data produces a visible, actionable failure result before any partial import is accepted as complete.

## Assumptions

- The first migrated release remains a single-user product with one shared remote data space and no account separation.
- `backup.json` is the authoritative seed for existing production data in this migration.
- Existing local export/import semantics remain user-facing backup tools unless replaced by an equivalent restore/export workflow in planning.
- The migrated product should not require offline-first behavior in this phase; recoverable remote failure states are sufficient.
- The documented personal-use scale from the current plan remains the target: up to 5 years of data, 60 monthly budgets, 20 categories per month, 5,000 expenses, 20 financial balance items, and 60 balance snapshots.
