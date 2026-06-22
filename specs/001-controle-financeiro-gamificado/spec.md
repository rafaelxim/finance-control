# Feature Specification: Controle Financeiro Gamificado

**Feature Branch**: `001-controle-financeiro-gamificado`

**Created**: 2026-06-21

**Status**: Draft

**Input**: User description: "quero uma aplicação que me ajude a controlar minhas finanças de forma gamificada. Digamos que eu tenha um valor específico, fixo, mas que pode ser alterado, para gastar por mês, a aplicação deverá criar slots/cards que representem o quanto eu posso gastar durante o mês com cada categoria. Os percentuais ou valores de cada categoria podem ser decididos pelo usuário, assim como as categorias. Além disso, a aplicação deve servir como controle de balanço: todo mês eu atualizo o balanço das minhas contas, investimentos e saldos de cartões de crédito para controlar minha evolução financeira ao longo do tempo. A referência visual atual é o arquivo DESIGN-binance.md."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Planejar orçamento mensal por categorias (Priority: P1)

Como usuário, quero informar meu valor mensal disponível e dividi-lo em
categorias personalizadas para enxergar quanto posso gastar em cada área do mês
por meio de cards temáticos e gamificados.

**Why this priority**: Esta é a base do produto: sem orçamento mensal e divisão
por categorias, o usuário não consegue controlar o limite de gastos do mês.

**Independent Test**: Pode ser testado criando um mês com R$ 1.000,00 de valor
disponível, adicionando categorias como aluguel, comida e lazer, e verificando
se os cards mostram os limites definidos e o total alocado corretamente.

**Acceptance Scenarios**:

1. **Given** um usuário sem orçamento no mês atual, **When** ele informa R$ 1.000,00 como valor mensal e cria categorias de R$ 400,00, R$ 300,00 e R$ 100,00, **Then** a aplicação exibe três cards com os limites definidos e R$ 200,00 ainda não alocados.
2. **Given** um orçamento mensal já configurado, **When** o usuário altera o valor mensal disponível, **Then** a aplicação mantém as categorias existentes e mostra claramente se a soma delas cabe ou excede o novo valor.
3. **Given** uma categoria existente, **When** o usuário altera seu valor ou percentual, **Then** a aplicação recalcula o limite da categoria e o saldo mensal disponível sem perder o histórico do mês.

---

### User Story 2 - Acompanhar gastos e progresso gamificado (Priority: P2)

Como usuário, quero registrar gastos nas categorias do mês e acompanhar meu
progresso por uma experiência visual de plataforma financeira, para perceber
rapidamente onde ainda posso gastar e onde estou passando do limite.

**Why this priority**: O planejamento só gera valor se o usuário conseguir
acompanhar o consumo real durante o mês e receber feedback claro sobre o
orçamento restante.

**Independent Test**: Pode ser testado registrando despesas em uma categoria e
verificando se o card atualiza o valor gasto, saldo restante, estado visual e
mensagem de alerta quando o limite é atingido ou ultrapassado.

**Acceptance Scenarios**:

1. **Given** uma categoria "Comida" com limite de R$ 300,00, **When** o usuário registra uma despesa de R$ 75,00 nessa categoria, **Then** o card mostra R$ 75,00 gastos e R$ 225,00 restantes.
2. **Given** uma categoria próxima do limite, **When** o usuário registra uma nova despesa que ultrapassa o limite, **Then** a aplicação destaca o estouro da categoria e mantém o valor excedente visível.
3. **Given** categorias com diferentes níveis de uso, **When** o usuário visualiza o painel mensal, **Then** cada card usa estados gamificados consistentes para indicar seguro, atenção, limite atingido ou limite excedido.

---

### User Story 3 - Atualizar balanço patrimonial mensal (Priority: P3)

Como usuário, quero registrar mensalmente os saldos das minhas contas,
investimentos e cartões de crédito para acompanhar minha evolução financeira ao
longo do tempo.

**Why this priority**: Além do orçamento mensal, o usuário precisa medir se está
acumulando patrimônio, reduzindo dívidas ou piorando sua posição financeira ao
longo dos meses.

**Independent Test**: Pode ser testado criando dois fechamentos mensais com
saldos diferentes e verificando se a aplicação calcula patrimônio líquido,
variação mensal e histórico por tipo de saldo.

**Acceptance Scenarios**:

1. **Given** um mês sem fechamento, **When** o usuário informa saldos de contas, investimentos e cartões de crédito, **Then** a aplicação registra um fechamento mensal com ativos, dívidas e patrimônio líquido.
2. **Given** fechamentos em dois meses consecutivos, **When** o usuário acessa a evolução financeira, **Then** a aplicação mostra a variação total e a variação por tipo de saldo.
3. **Given** um fechamento mensal já registrado, **When** o usuário corrige um saldo, **Then** a aplicação recalcula os totais daquele mês e preserva a comparação com os demais meses.

---

### User Story 4 - Ajustar categorias e metas ao longo do tempo (Priority: P4)

Como usuário, quero editar categorias, percentuais, valores e tema visual sem
perder meses anteriores, para adaptar o controle financeiro conforme minha vida
muda.

**Why this priority**: Orçamentos pessoais mudam com renda, aluguel, hábitos e
metas. A aplicação precisa permitir ajustes sem destruir histórico.

**Independent Test**: Pode ser testado alterando categorias no mês atual e
verificando que meses anteriores continuam consultáveis com os valores usados na
época.

**Acceptance Scenarios**:

1. **Given** uma categoria usada em meses anteriores, **When** o usuário renomeia a categoria no mês atual, **Then** a aplicação deixa claro como o histórico será exibido e mantém os registros anteriores consultáveis.
2. **Given** um orçamento mensal antigo, **When** o usuário consulta esse mês, **Then** a aplicação mostra os valores e categorias válidos naquele período.

### Edge Cases

- O total das categorias pode ser menor que o valor mensal disponível; a
  aplicação deve exibir o saldo não alocado.
- O total das categorias pode exceder o valor mensal disponível; a aplicação
  deve bloquear a confirmação ou exigir confirmação explícita do usuário.
- O usuário pode definir categorias por valor fixo ou percentual; a aplicação
  deve mostrar a equivalência em reais e recalcular quando o valor mensal mudar.
- O usuário pode registrar gasto sem categoria adequada; a aplicação deve
  permitir escolher uma categoria existente ou criar uma nova.
- O usuário pode ter renda ou valor mensal disponível igual a zero; a aplicação
  deve explicar que não há limite distribuível e evitar divisões por percentual.
- O usuário pode registrar itens de dívida; a aplicação deve tratá-los como
  redução do patrimônio no balanço mensal.
- O usuário pode corrigir fechamentos antigos; a aplicação deve recalcular a
  evolução sem apagar os demais meses.
- Estados de carregamento, lista vazia, validação e recuperação devem usar
  linguagem clara e visual consistente com o tema gamificado.
- Histórico com vários anos de meses, categorias e saldos deve continuar fácil
  de filtrar, comparar e consultar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O usuário DEVE conseguir criar um orçamento mensal informando um valor total disponível em reais brasileiros.
- **FR-002**: O usuário DEVE conseguir criar, editar, reordenar, arquivar e consultar categorias de gasto personalizadas.
- **FR-003**: O usuário DEVE conseguir definir cada categoria por valor fixo ou por percentual do valor mensal disponível.
- **FR-004**: A aplicação DEVE calcular valor alocado, valor não alocado e valor excedente do orçamento mensal.
- **FR-005**: A aplicação DEVE exibir cada categoria mensal como um card gamificado com limite, valor gasto, valor restante e estado de uso.
- **FR-006**: O usuário DEVE conseguir registrar despesas com valor, data, categoria e descrição opcional.
- **FR-007**: A aplicação DEVE atualizar os cards de categoria após cada despesa e identificar claramente os estados seguro, atenção, limite atingido e limite excedido.
- **FR-008**: A aplicação DEVE seguir a referência visual `DESIGN-binance.md`, usando canvas escuro, acento amarelo, cards financeiros densos e sinais verde/vermelho apenas para estados positivos e negativos.
- **FR-009**: O usuário DEVE conseguir criar um fechamento financeiro mensal contendo saldos de contas, investimentos e cartões de crédito.
- **FR-010**: A aplicação DEVE calcular ativos mensais, dívidas, patrimônio líquido e variação mês a mês a partir dos fechamentos.
- **FR-011**: O usuário DEVE conseguir visualizar a evolução histórica por mês, incluindo totais e detalhamento por ativo e dívida.
- **FR-012**: O usuário DEVE conseguir editar orçamentos, despesas e fechamentos financeiros atuais e passados, com recálculo dos totais afetados.
- **FR-013**: A aplicação DEVE preservar os dados históricos de cada mês para que mudanças posteriores de categoria ou orçamento não reescrevam meses anteriores silenciosamente.
- **FR-014**: A aplicação DEVE apresentar mensagens de validação quando valores obrigatórios estiverem ausentes, negativos, inconsistentes ou fora das restrições financeiras esperadas.
- **FR-015**: A aplicação DEVE preservar terminologia, navegação, validação, carregamento, estados vazios e padrões de erro consistentes nos fluxos afetados.
- **FR-016**: A aplicação DEVE permitir que o usuário conclua a configuração principal de orçamento mensal e o fechamento mensal sem ler instruções externas.
- **FR-017**: A aplicação DEVE exibir as visões de orçamento e balanço mensal rápido o suficiente para que o usuário consulte o mês atual sem atraso perceptível em um histórico normal de uso pessoal.

### Key Entities *(include if feature involves data)*

- **Usuário**: Pessoa que gerencia o próprio orçamento, gastos e evolução
  financeira.
- **Orçamento Mensal**: Configuração de um mês com valor disponível, categorias,
  total alocado, saldo não alocado e estado de excesso.
- **Categoria de Gasto**: Grupo personalizável como aluguel, comida ou lazer,
  com nome, tipo de alocação, valor ou percentual, estado e histórico.
- **Card Gamificado**: Representação visual de uma categoria no mês, incluindo
  limite, progresso de uso, saldo restante e estado temático.
- **Despesa**: Registro de gasto com valor, data, categoria e descrição
  opcional.
- **Fechamento Mensal**: Registro mensal dos saldos financeiros que permite
  acompanhar evolução ao longo do tempo.
- **Ativo**: Saldo que aumenta o patrimônio do usuário, como conta corrente,
  carteira, dinheiro disponível ou investimentos.
- **Dívida**: Saldo devedor que reduz o patrimônio do usuário no fechamento
  mensal.
- **Evolução Financeira**: Série histórica calculada a partir dos fechamentos
  mensais, mostrando ativos, dívidas, patrimônio líquido e variações.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% dos usuários conseguem configurar um orçamento mensal com pelo menos três categorias em até 5 minutos.
- **SC-002**: 95% dos usuários conseguem identificar, em até 10 segundos, quais categorias ainda têm saldo disponível e quais ultrapassaram o limite.
- **SC-003**: 90% dos usuários conseguem registrar uma despesa em até 30 segundos depois de abrir o painel do mês.
- **SC-004**: 90% dos usuários conseguem registrar um fechamento mensal com contas, investimentos e cartões em até 7 minutos.
- **SC-005**: A aplicação calcula corretamente patrimônio líquido e variação mensal em 100% dos cenários de teste com ativos, dívidas e correções de saldo.
- **SC-006**: O painel mensal permanece consultável sem atraso perceptível para um histórico pessoal de pelo menos 5 anos de meses, categorias, despesas e fechamentos.
- **SC-007**: 85% dos usuários em validação conseguem explicar o significado dos estados gamificados dos cards sem ajuda externa.
- **SC-008**: Mudanças em categorias ou orçamento do mês atual preservam 100% dos valores históricos de meses já fechados.

## Assumptions

- A primeira versão é focada em uso individual, sem múltiplos usuários,
  permissões compartilhadas ou contas familiares.
- A moeda padrão é real brasileiro (BRL).
- "Valor mensal disponível" representa o dinheiro que o usuário deseja
  controlar no mês, podendo ser salário, renda líquida ou outro limite definido
  manualmente.
- Categorias podem misturar valor fixo e percentual no mesmo orçamento, desde
  que a aplicação mostre os totais resultantes.
- A referência visual principal é `DESIGN-binance.md`; o app não usa temas,
  nomes, imagens ou assets de marcas externas licenciadas.
- O balanço mensal usa saldos informados manualmente pelo usuário; integrações
  automáticas com bancos, corretoras ou operadoras de cartão ficam fora do
  escopo inicial.
- Cartões de crédito entram no balanço como dívida quando possuem saldo devedor.
- Histórico financeiro deve ser retido enquanto o usuário não excluir
  explicitamente os dados.
