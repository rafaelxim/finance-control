import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DashboardFinancialSummary, {
  type DashboardFinancialSummaryViewModel
} from '@/components/finance/DashboardFinancialSummary.vue'

const mountSummary = (summary: DashboardFinancialSummaryViewModel) =>
  mount(DashboardFinancialSummary, {
    props: { summary },
    global: {
      stubs: {
        RouterLink: {
          props: ['to'],
          template: '<a :href="to"><slot /></a>'
        }
      }
    }
  })

describe('DashboardFinancialSummary', () => {
  it('renders a balance-backed primary amount with state and comparison', () => {
    const wrapper = mountSummary({
      label: 'Patrimônio líquido',
      primaryAmount: '12500.00',
      comparisonLabel: 'Variação mais recente',
      comparisonAmount: '-300.00',
      state: 'negative',
      stateLabel: 'Patrimônio caiu',
      stateDescription: 'A variação mais recente está negativa.',
      actionLabel: 'Atualizar balanço',
      actionTarget: '/balanco',
      source: 'balance'
    })

    expect(wrapper.attributes('data-state')).toBe('negative')
    expect(wrapper.text()).toContain('Patrimônio líquido')
    expect(wrapper.text()).toContain('Patrimônio caiu')
    expect(wrapper.text()).toContain('A variação mais recente está negativa.')
    expect(wrapper.text()).toContain('-R$')
    expect(wrapper.text()).toContain('Baseado no último balanço')
    expect(wrapper.get('a').attributes('href')).toBe('/balanco')
  })

  it('renders a budget-backed fallback without fake balance data', () => {
    const wrapper = mountSummary({
      label: 'Saldo disponível do mês',
      primaryAmount: '200.00',
      comparisonLabel: 'Ainda não alocado',
      comparisonAmount: '200.00',
      state: 'positive',
      stateLabel: 'Saldo disponível',
      stateDescription: 'Ainda há verba para distribuir no mês.',
      actionLabel: 'Ajustar orçamento',
      actionTarget: '/orcamento',
      source: 'budget'
    })

    expect(wrapper.attributes('data-state')).toBe('positive')
    expect(wrapper.text()).toContain('Saldo disponível do mês')
    expect(wrapper.text()).toContain('Saldo disponível')
    expect(wrapper.text()).toContain('Baseado no orçamento do mês')
    expect(wrapper.text()).not.toContain('Baseado no último balanço')
    expect(wrapper.get('a').attributes('href')).toBe('/orcamento')
  })

  it('keeps long BRL values readable in the rendered text', () => {
    const wrapper = mountSummary({
      label: 'Patrimônio líquido',
      primaryAmount: '123456789.99',
      comparisonLabel: 'Variação mais recente',
      comparisonAmount: '9876543.21',
      state: 'positive',
      source: 'balance'
    })

    expect(wrapper.text()).toContain('R$')
    expect(wrapper.find('.money--hero').exists()).toBe(true)
  })

  it('exposes compact horizontal summary groups', () => {
    const wrapper = mountSummary({
      label: 'Patrimônio líquido',
      primaryAmount: '0.00',
      comparisonLabel: 'Variação mais recente',
      comparisonAmount: '-100.00',
      state: 'negative',
      stateLabel: 'Patrimônio caiu',
      stateDescription: 'A variação mais recente está negativa.',
      primaryAmountEmphasis: 'reduced',
      source: 'balance'
    })

    expect(wrapper.find('.dashboard-summary__content').exists()).toBe(true)
    expect(wrapper.find('.dashboard-summary__primary').exists()).toBe(true)
    expect(wrapper.find('.dashboard-summary__meta').exists()).toBe(true)
    expect(wrapper.find('.dashboard-summary__amount--reduced').exists()).toBe(true)
  })

  it('renders cause-oriented labels for neutral zero and budget excess states', () => {
    const neutralZero = mountSummary({
      label: 'Patrimônio zerado',
      primaryAmount: '0.00',
      comparisonLabel: 'Variação mais recente',
      comparisonAmount: '0.00',
      state: 'neutral',
      stateLabel: 'Patrimônio zerado',
      stateDescription: 'Cadastre ativos ou dívidas para acompanhar a evolução.',
      primaryAmountEmphasis: 'reduced',
      actionLabel: 'Atualizar balanço',
      actionTarget: '/balanco',
      source: 'balance'
    })

    const budgetExcess = mountSummary({
      label: 'Excedente planejado',
      primaryAmount: '120.00',
      comparisonLabel: 'Orçamento acima do disponível',
      comparisonAmount: '120.00',
      state: 'negative',
      stateLabel: 'Orçamento excedido',
      stateDescription: 'O planejamento passou do valor disponível.',
      actionLabel: 'Ajustar orçamento',
      actionTarget: '/orcamento',
      source: 'budget'
    })

    expect(neutralZero.text()).toContain('Patrimônio zerado')
    expect(neutralZero.find('.dashboard-summary__amount--reduced').exists()).toBe(true)
    expect(budgetExcess.text()).toContain('Orçamento excedido')
    expect(budgetExcess.get('a').attributes('href')).toBe('/orcamento')
  })
})
