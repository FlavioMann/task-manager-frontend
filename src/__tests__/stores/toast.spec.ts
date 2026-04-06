import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useToastStore } from '@/stores/toast'

describe('useToastStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('inicia com lista vazia', () => {
    const toast = useToastStore()
    expect(toast.toasts).toHaveLength(0)
  })

  it('adiciona um toast de sucesso', () => {
    const toast = useToastStore()
    toast.success('Operação realizada!')
    expect(toast.toasts).toHaveLength(1)
    expect(toast.toasts[0]!.message).toBe('Operação realizada!')
    expect(toast.toasts[0]!.type).toBe('success')
  })

  it('adiciona um toast de erro', () => {
    const toast = useToastStore()
    toast.error('Algo deu errado')
    expect(toast.toasts[0]!.type).toBe('error')
  })

  it('adiciona um toast info', () => {
    const toast = useToastStore()
    toast.info('Informação')
    expect(toast.toasts[0]!.type).toBe('info')
  })

  it('adiciona um toast warning', () => {
    const toast = useToastStore()
    toast.warning('Atenção')
    expect(toast.toasts[0]!.type).toBe('warning')
  })

  it('remove toast automaticamente após 4s', () => {
    const toast = useToastStore()
    toast.success('Auto remove')
    expect(toast.toasts).toHaveLength(1)
    vi.advanceTimersByTime(4000)
    expect(toast.toasts).toHaveLength(0)
  })

  it('remove toast manualmente pelo id', () => {
    const toast = useToastStore()
    toast.success('Remove manual')
    const id = toast.toasts[0]!.id
    toast.remove(id)
    expect(toast.toasts).toHaveLength(0)
  })

  it('suporta múltiplos toasts simultâneos', () => {
    const toast = useToastStore()
    toast.success('Um')
    toast.error('Dois')
    toast.info('Três')
    expect(toast.toasts).toHaveLength(3)
  })

  it('cada toast tem id único', () => {
    const toast = useToastStore()
    toast.success('A')
    toast.success('B')
    const ids = toast.toasts.map((t) => t.id)
    expect(new Set(ids).size).toBe(2)
  })
})
