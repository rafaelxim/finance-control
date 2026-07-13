<template>
  <main class="legal-page">
    <article class="legal-document" aria-labelledby="legal-title">
      <RouterLink class="legal-document__back" to="/privacidade">
        Voltar para a política de privacidade
      </RouterLink>

      <header class="legal-document__header">
        <p class="legal-document__eyebrow">LGPD</p>
        <h1 id="legal-title">Bases legais por operação de tratamento</h1>
        <p>
          Última atualização: 13 de julho de 2026. Esta matriz descreve a base legal
          prevista para cada operação de tratamento de dados pessoais no OrganizaGrana.
        </p>
      </header>

      <section>
        <h2>Matriz de tratamento</h2>
        <div class="legal-table" role="region" aria-label="Tabela de bases legais" tabindex="0">
          <table>
            <thead>
              <tr>
                <th>Operação</th>
                <th>Dados tratados</th>
                <th>Finalidade</th>
                <th>Base legal prevista</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Criar conta</td>
                <td>Email, senha, identificador de usuário e metadados técnicos de Auth.</td>
                <td>Permitir cadastro, login e proteção da conta.</td>
                <td>Execução de contrato ou procedimentos preliminares relacionados ao serviço.</td>
              </tr>
              <tr>
                <td>Autenticar usuário</td>
                <td>Email, senha, sessões, tokens e eventos de autenticação.</td>
                <td>Permitir acesso seguro aos dados financeiros do próprio usuário.</td>
                <td>Execução de contrato e legítimo interesse para segurança da aplicação.</td>
              </tr>
              <tr>
                <td>Manter perfil de uso</td>
                <td>Moeda, mês ativo, tema e nome de exibição quando preenchido.</td>
                <td>Personalizar a experiência e carregar o contexto financeiro correto.</td>
                <td>Execução de contrato.</td>
              </tr>
              <tr>
                <td>Registrar orçamentos e categorias</td>
                <td>Mês, valores, limites, nomes de categorias e observações.</td>
                <td>Organizar planejamento financeiro mensal.</td>
                <td>Execução de contrato.</td>
              </tr>
              <tr>
                <td>Registrar despesas</td>
                <td>Valor, data, categoria, descrição e vínculo ao orçamento.</td>
                <td>Acompanhar gastos informados pelo usuário.</td>
                <td>Execução de contrato.</td>
              </tr>
              <tr>
                <td>Registrar patrimônio e balanço</td>
                <td>Snapshots, itens, instituições, valores e observações.</td>
                <td>Calcular e acompanhar patrimônio informado pelo usuário.</td>
                <td>Execução de contrato.</td>
              </tr>
              <tr>
                <td>Salvar preferências visuais</td>
                <td>Cores e preferências de categorias.</td>
                <td>Melhorar usabilidade e identificação visual das categorias.</td>
                <td>Execução de contrato.</td>
              </tr>
              <tr>
                <td>Exportar dados</td>
                <td>Payload JSON com perfil, orçamentos, despesas, balanços e preferências.</td>
                <td>Permitir portabilidade, backup pessoal e acesso aos próprios dados.</td>
                <td>Cumprimento de direito do titular e execução de contrato.</td>
              </tr>
              <tr>
                <td>Importar dados</td>
                <td>Payload JSON fornecido pelo usuário.</td>
                <td>Restaurar dados e manter continuidade do uso.</td>
                <td>Execução de contrato.</td>
              </tr>
              <tr>
                <td>Limpar dados financeiros</td>
                <td>Identificadores e registros financeiros associados ao usuário.</td>
                <td>Remover dados de negócio mantendo a conta ativa.</td>
                <td>Cumprimento de direito do titular e execução de contrato.</td>
              </tr>
              <tr>
                <td>Excluir conta</td>
                <td>Conta de autenticação, sessões, perfil e registros associados.</td>
                <td>Atender solicitação de exclusão e encerrar o uso do serviço.</td>
                <td>Cumprimento de direito do titular.</td>
              </tr>
              <tr>
                <td>Manter logs técnicos</td>
                <td>Data/hora, status de requisição, identificadores técnicos e erros.</td>
                <td>Segurança, diagnóstico, auditoria operacional e prevenção de abuso.</td>
                <td>Legítimo interesse e, quando aplicável, obrigação legal.</td>
              </tr>
              <tr>
                <td>Hospedar e entregar o frontend</td>
                <td>Metadados técnicos de acesso processados pela hospedagem.</td>
                <td>Disponibilizar a aplicação no navegador.</td>
                <td>Execução de contrato e legítimo interesse operacional.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Observações</h2>
        <ul>
          <li>
            Consentimento não é usado como base legal padrão para operações essenciais quando a
            operação é necessária para prestar o serviço solicitado pelo usuário.
          </li>
          <li>
            Dados financeiros inseridos pelo usuário podem revelar aspectos relevantes da vida
            financeira e exigem minimização, controle de acesso e RLS por usuário.
          </li>
          <li>
            Bases legais devem ser revistas se o app adicionar marketing, analytics, integrações
            bancárias, compartilhamento com terceiros ou uso secundário dos dados.
          </li>
          <li>
            Operações baseadas em legítimo interesse devem ter avaliação documentada de
            necessidade, proporcionalidade e expectativa do titular antes de uso público.
          </li>
        </ul>
      </section>
    </article>
  </main>
</template>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  padding: 32px 20px;
}

.legal-document {
  display: grid;
  width: min(100%, 1040px);
  gap: 24px;
  margin: 0 auto;
}

.legal-document__back {
  width: fit-content;
  color: var(--color-primary);
  font-size: 0.92rem;
  font-weight: 800;
  text-decoration: none;
}

.legal-document__back:hover,
.legal-document__back:focus-visible {
  text-decoration: underline;
}

.legal-document__header {
  display: grid;
  gap: 10px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 22px;
}

.legal-document__eyebrow {
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0;
  margin: 0;
  text-transform: uppercase;
}

.legal-document h1,
.legal-document h2,
.legal-document p {
  margin: 0;
}

.legal-document h1 {
  max-width: 820px;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1;
}

.legal-document h2 {
  color: var(--color-text);
  font-size: 1.05rem;
}

.legal-document p,
.legal-document li,
.legal-document td,
.legal-document th {
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.legal-document section {
  display: grid;
  gap: 10px;
}

.legal-document ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 20px;
}

.legal-table {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}

.legal-table table {
  width: 100%;
  min-width: 940px;
  border-collapse: collapse;
}

.legal-table th,
.legal-table td {
  border-bottom: 1px solid var(--color-border);
  padding: 12px;
  text-align: left;
  vertical-align: top;
}

.legal-table th {
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 850;
}

.legal-table tr:last-child td {
  border-bottom: 0;
}

@media (max-width: 640px) {
  .legal-page {
    padding: 24px 16px;
  }

  .legal-document {
    gap: 20px;
  }
}
</style>
