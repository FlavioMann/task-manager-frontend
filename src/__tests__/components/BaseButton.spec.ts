import  BaseButton  from '@/components/ui/BaseButton.vue';
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

describe('BaseButton', () => {
  it('renderiza o slot corretamente', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Clique aqui' } })
    expect(wrapper.text()).toContain('Clique aqui')
  })

  it('aplica estilo primary por padrão', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.classes()).toContain('bg-blue-600')
  })

  it('aplica estilo secondary quando variant="secondary"', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'secondary' } })
    expect(wrapper.classes()).toContain('border-gray-300')
  })

  it('aplica estilo ghost quando variant="ghost"', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'ghost' } })
    expect(wrapper.classes()).toContain('text-gray-600')
  })

  it('fica desabilitado quando disabled=true', () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('exibe spinner quando loading=true', () => {
    const wrapper = mount(BaseButton, { props: { loading: true } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('ocupa largura total quando full=true', () => {
    const wrapper = mount(BaseButton, { props: { full: true } })
    expect(wrapper.classes()).toContain('w-full')
  })
})
