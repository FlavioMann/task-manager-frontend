import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MetricCard from '@/components/tasks/MetricCard.vue'

describe('MetricCard', () => {
  it('exibe o label e o valor corretamente', () => {
    const wrapper = mount(MetricCard, { props: { label: 'Total', value: 42, color: 'gray' } })
    expect(wrapper.text()).toContain('Total')
    expect(wrapper.text()).toContain('42')
  })

  it('aceita valor como string', () => {
    const wrapper = mount(MetricCard, { props: { label: 'Progresso', value: '50%', color: 'blue' } })
    expect(wrapper.text()).toContain('50%')
  })

  it('exibe barra de progresso quando progress é fornecido', () => {
    const wrapper = mount(MetricCard, {
      props: { label: 'Progresso', value: '75%', color: 'blue', progress: '75%' },
    })
    const bar = wrapper.find('[style]')
    expect(bar.exists()).toBe(true)
    expect(bar.attributes('style')).toContain('75%')
  })

  it('não exibe barra quando progress não é fornecido', () => {
    const wrapper = mount(MetricCard, { props: { label: 'Total', value: 10, color: 'gray' } })
    expect(wrapper.find('[style]').exists()).toBe(false)
  })
})
