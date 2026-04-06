import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge.vue'

describe('TaskStatusBadge', () => {
  it('exibe "Pendente" para status PENDING', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'PENDING' } })
    expect(wrapper.text()).toBe('Pendente')
  })

  it('exibe "Em andamento" para status IN_PROGRESS', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'IN_PROGRESS' } })
    expect(wrapper.text()).toBe('Em andamento')
  })

  it('exibe "Concluída" para status COMPLETED', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'COMPLETED' } })
    expect(wrapper.text()).toBe('Concluída')
  })

  it('aplica classe bg-yellow-100 para PENDING', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'PENDING' } })
    expect(wrapper.find('span').classes()).toContain('bg-yellow-100')
  })

  it('aplica classe bg-blue-100 para IN_PROGRESS', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'IN_PROGRESS' } })
    expect(wrapper.find('span').classes()).toContain('bg-blue-100')
  })

  it('aplica classe bg-green-100 para COMPLETED', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'COMPLETED' } })
    expect(wrapper.find('span').classes()).toContain('bg-green-100')
  })
})
