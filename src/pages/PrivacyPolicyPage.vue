<template>
  <main class="privacy-page">
    <article class="privacy-document" aria-labelledby="privacy-title">
      <RouterLink class="privacy-document__back" to="/login">Voltar para o login</RouterLink>

      <header class="privacy-document__header">
        <p class="privacy-document__eyebrow">Aviso de privacidade</p>
        <h1 id="privacy-title">Política de privacidade do OrganizaGrana</h1>
        <p>
          Última atualização: 13 de julho de 2026. Este aviso descreve como o app trata
          dados pessoais para autenticação e controle financeiro.
        </p>
      </header>

      <section>
        <h2>1. Quem controla os dados</h2>
        <p>
          O OrganizaGrana é o controlador dos dados inseridos no app. O contato formal do
          controlador e do canal LGPD ainda deve ser definido antes de uso público.
        </p>
      </section>

      <section>
        <h2>2. Quais dados tratamos</h2>
        <ul>
          <li>Email, senha e dados técnicos de autenticação gerenciados pelo Supabase Auth.</li>
          <li>Perfil de uso, como moeda, mês ativo, tema e nome de exibição quando preenchido.</li>
          <li>Orçamentos, categorias, limites, despesas, datas, descrições e observações.</li>
          <li>Snapshots de patrimônio, itens de balanço, instituições e observações financeiras.</li>
          <li>Preferências visuais de categorias e backups JSON gerados pelo usuário.</li>
        </ul>
      </section>

      <section>
        <h2>3. Para quais finalidades</h2>
        <ul>
          <li>Criar e proteger a conta do usuário.</li>
          <li>Carregar, salvar e organizar os dados financeiros informados pelo usuário.</li>
          <li>Permitir exportação, restauração e manutenção dos dados da aplicação.</li>
          <li>Manter segurança, prevenção de acessos indevidos e funcionamento técnico do app.</li>
        </ul>
      </section>

      <section>
        <h2>4. Bases legais previstas</h2>
        <p>
          O tratamento principal ocorre para executar o serviço solicitado pelo usuário:
          registrar e consultar seus próprios dados financeiros. Medidas de segurança,
          prevenção a fraude e manutenção técnica podem se apoiar em legítimo interesse ou
          obrigação legal, conforme o caso.
        </p>
      </section>

      <section>
        <h2>5. Compartilhamento e infraestrutura</h2>
        <p>
          O app usa Supabase para autenticação, banco de dados Postgres e Data API. A
          hospedagem do frontend é prevista na Netlify. Não há integração bancária, corretora,
          cartão, venda de dados pessoais ou compartilhamento comercial dos dados financeiros.
        </p>
      </section>

      <section>
        <h2>6. Segurança</h2>
        <p>
          As tabelas financeiras usam autenticação, isolamento por usuário e Row Level Security
          no Supabase. O frontend usa chave publicável; chaves secretas e service role não devem
          ser expostas no navegador.
        </p>
      </section>

      <section>
        <h2>7. Retenção e exclusão</h2>
        <p>
          Dados financeiros, perfil e preferências permanecem armazenados enquanto a conta
          existir ou até o usuário solicitar limpeza financeira ou exclusão completa da conta.
          Backups JSON baixados não são mantidos pelo app após o download. Logs e eventos
          técnicos seguem as configurações de retenção dos provedores, como Supabase e Netlify.
          Consulte a
          <RouterLink to="/retencao-de-dados">política de retenção de dados</RouterLink>
          para ver categorias, prazos e eventos de exclusão.
        </p>
      </section>

      <section>
        <h2>8. Direitos do titular</h2>
        <p>
          O usuário pode solicitar confirmação de tratamento, acesso, correção, portabilidade,
          exclusão, informação sobre compartilhamentos e oposição nos casos previstos na LGPD.
          O canal operacional para essas solicitações ainda deve ser publicado antes de uso
          público.
        </p>
      </section>

      <section>
        <h2>9. Alterações deste aviso</h2>
        <p>
          Este aviso pode ser atualizado quando o app evoluir, especialmente ao implementar
          canal LGPD, novas integrações ou ajustes na política de retenção.
        </p>
      </section>
    </article>
  </main>
</template>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  padding: 32px 20px;
}

.privacy-document {
  display: grid;
  width: min(100%, 920px);
  gap: 24px;
  margin: 0 auto;
}

.privacy-document__back {
  width: fit-content;
  color: var(--color-primary);
  font-size: 0.92rem;
  font-weight: 800;
  text-decoration: none;
}

.privacy-document__back:hover,
.privacy-document__back:focus-visible {
  text-decoration: underline;
}

.privacy-document a:not(.privacy-document__back) {
  color: var(--color-primary);
  font-weight: 800;
  text-decoration: none;
}

.privacy-document a:not(.privacy-document__back):hover,
.privacy-document a:not(.privacy-document__back):focus-visible {
  text-decoration: underline;
}

.privacy-document__header {
  display: grid;
  gap: 10px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 22px;
}

.privacy-document__eyebrow {
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.privacy-document h1,
.privacy-document h2,
.privacy-document p {
  margin: 0;
}

.privacy-document h1 {
  max-width: 760px;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1;
}

.privacy-document h2 {
  color: var(--color-text);
  font-size: 1.05rem;
}

.privacy-document p,
.privacy-document li {
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.privacy-document section {
  display: grid;
  gap: 10px;
}

.privacy-document ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 20px;
}

@media (max-width: 640px) {
  .privacy-page {
    padding: 24px 16px;
  }

  .privacy-document {
    gap: 20px;
  }
}
</style>
