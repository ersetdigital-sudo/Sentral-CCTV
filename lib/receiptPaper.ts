'use client'

import { useSyncExternalStore } from 'react'

/**
 * State kecil untuk kertas struk (58mm / 80mm).
 * Dipakai di luar React tree (modal dirender oleh ModalProvider) agar
 * provider tidak saling bergantung secara bersarang.
 */
let paper = '80'
const listeners = new Set<() => void>()

export const receiptPaper = {
  get: () => paper,
  set: (value: string) => {
    paper = value
    listeners.forEach((l) => l())
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useReceiptPaper(): string {
  return useSyncExternalStore(receiptPaper.subscribe, receiptPaper.get, receiptPaper.get)
}
