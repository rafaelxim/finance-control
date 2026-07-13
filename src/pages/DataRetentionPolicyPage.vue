<template>
  <main class="retention-page">
    <article class="retention-document" aria-labelledby="retention-title">
      <RouterLink class="retention-document__back" to="/privacidade">
        Voltar para a política de privacidade
      </RouterLink>

      <header class="retention-document__header">
        <p class="retention-document__eyebrow">Retenção de dados</p>
        <h1 id="retention-title">Política de retenção de dados</h1>
        <p>
          Última atualização: 13 de julho de 2026. Esta política define por quanto tempo o
          OrganizaGrana mantém dados pessoais e financeiros tratados pela aplicação.
        </p>
      </header>

      <section>
        <h2>Princípios</h2>
        <ul>
          <li>Manter dados somente enquanto forem necessários para prestar o serviço.</li>
          <li>Permitir que o usuário exporte seus dados antes de limpeza ou exclusão.</li>
          <li>Remover dados financeiros quando o usuário solicitar limpeza financeira.</li>
          <li>Remover conta, sessões e registros associados na exclusão completa da conta.</li>
          <li>Não manter backups JSON no servidor da aplicação após o download.</li>
        </ul>
      </section>

      <section>
        <h2>Categorias e prazos</h2>
        <div class="retention-table" role="region" aria-label="Tabela de retenção" tabindex="0">
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Exemplos</th>
                <th>Retenção padrão</th>
                <th>Evento de exclusão</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Conta de autenticação</td>
                <td>Email, identificador do usuário e metadados técnicos de Auth.</td>
                <td>Enquanto a conta existir.</td>
                <td>Exclusão completa da conta.</td>
              </tr>
              <tr>
                <td>Sessões e eventos de autenticação</td>
                <td>Tokens, refresh tokens, eventos de login e logs do provedor.</td>
                <td>Conforme configuração e retenção do Supabase.</td>
                <td>Revogação de sessões na exclusão da conta, respeitando limites do provedor.</td>
              </tr>
              <tr>
                <td>Perfil de uso</td>
                <td>Moeda, mês ativo, tema e nome de exibição quando preenchido.</td>
                <td>Enquanto a conta existir.</td>
                <td>Exclusão completa da conta.</td>
              </tr>
              <tr>
                <td>Dados financeiros</td>
                <td>Orçamentos, categorias, despesas, snapshots, instituições e observações.</td>
                <td>Enquanto a conta existir ou até limpeza financeira.</td>
                <td>Limpeza financeira ou exclusão completa da conta.</td>
              </tr>
              <tr>
                <td>Preferências visuais</td>
                <td>Cores e preferências de categorias.</td>
                <td>Enquanto a conta existir ou até limpeza financeira.</td>
                <td>Limpeza financeira ou exclusão completa da conta.</td>
              </tr>
              <tr>
                <td>Backups JSON exportados</td>
                <td>Arquivo baixado pelo usuário com dados exportáveis.</td>
                <td>Não armazenado pelo app após o download.</td>
                <td>Controle exclusivo do usuário sobre o arquivo baixado.</td>
              </tr>
              <tr>
                <td>Logs de aplicação e hospedagem</td>
                <td>Logs técnicos de Netlify, Supabase e Edge Functions.</td>
                <td>Conforme retenção configurada nos provedores.</td>
                <td>Expiração automática do provedor ou solicitação operacional quando aplicável.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Limpeza financeira</h2>
        <p>
          A limpeza financeira remove despesas, categorias, orçamentos, itens de balanço,
          snapshots de balanço e preferências visuais. Ela mantém a conta de autenticação, email,
          perfil de uso e sessões ativas.
        </p>
      </section>

      <section>
        <h2>Exclusão completa da conta</h2>
        <p>
          A exclusão completa deve validar a sessão autenticada, revogar sessões, remover
          registros associados ao usuário, excluir o usuário no Supabase Auth, limpar o estado
          local e redirecionar para o login.
        </p>
        <p>
          Após a exclusão, dados podem persistir temporariamente em logs, backups internos ou
          trilhas técnicas dos provedores, conforme políticas operacionais desses
          subprocessadores.
        </p>
      </section>

      <section>
        <h2>Backups e exportações</h2>
        <p>
          O app permite exportar dados em JSON para portabilidade e cópia pessoal. O app não deve
          manter cópia desse arquivo depois de iniciar o download no navegador.
        </p>
      </section>

      <section>
        <h2>Logs e revisão</h2>
        <p>
          Logs de Supabase, Netlify, Edge Functions e outros provedores devem ser mantidos pelo
          menor prazo operacional possível. Esta política deve ser revisada quando houver novo
          subprocessador, nova categoria de dado pessoal, mudança em autenticação, logs, backups
          ou publicação do app para terceiros.
        </p>
      </section>
    </article>
  </main>
</template>

<style scoped>
.retention-page {
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  padding: 32px 20px;
}

.retention-document {
  display: grid;
  width: min(100%, 980px);
  gap: 24px;
  margin: 0 auto;
}

.retention-document__back {
  width: fit-content;
  color: var(--color-primary);
  font-size: 0.92rem;
  font-weight: 800;
  text-decoration: none;
}

.retention-document__back:hover,
.retention-document__back:focus-visible {
  text-decoration: underline;
}

.retention-document__header {
  display: grid;
  gap: 10px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 22px;
}

.retention-document__eyebrow {
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0;
  margin: 0;
  text-transform: uppercase;
}

.retention-document h1,
.retention-document h2,
.retention-document p {
  margin: 0;
}

.retention-document h1 {
  max-width: 780px;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1;
}

.retention-document h2 {
  color: var(--color-text);
  font-size: 1.05rem;
}

.retention-document p,
.retention-document li,
.retention-document td,
.retention-document th {
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.retention-document section {
  display: grid;
  gap: 10px;
}

.retention-document ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 20px;
}

.retention-table {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}

.retention-table table {
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;
}

.retention-table th,
.retention-table td {
  border-bottom: 1px solid var(--color-border);
  padding: 12px;
  text-align: left;
  vertical-align: top;
}

.retention-table th {
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 850;
}

.retention-table tr:last-child td {
  border-bottom: 0;
}

@media (max-width: 640px) {
  .retention-page {
    padding: 24px 16px;
  }

  .retention-document {
    gap: 20px;
  }
}
</style>
