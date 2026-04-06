import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/ui/BaseInput.vue'

describe('BaseInput', () => {
  it('renderiza o label quando fornecido', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', label: 'E-mail' } })
    expect(wrapper.find('label').text()).toBe('E-mail')
  })

  it('não renderiza label quando não fornecido', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('exibe mensagem de erro', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', error: 'Campo obrigatório' } })
    expect(wrapper.find('span').text()).toBe('Campo obrigatório')
  })

  it('aplica classe de erro no input', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', error: 'Inválido' } })
    expect(wrapper.find('input').classes()).toContain('border-red-400')
  })

  it('emite update:modelValue ao digitar', async () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('novo valor')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['novo valor'])
  })

  it('usa type="text" por padrão', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('usa o type fornecido via prop', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', type: 'password' } })
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })
})
