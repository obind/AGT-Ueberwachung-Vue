import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Einsatz {
  bearbeiter: string
  einsatzbeginn: Date
  einsatzort: string
  notizen?: string
}

export const useEinsatzStore = defineStore('einsatz', () => {
  const einsatz = ref<Einsatz | null>(null)

  function setEinsatz(einsatzData: Einsatz) {
    einsatz.value = einsatzData
  }

  function updateEinsatz(updates: Partial<Einsatz>) {
    if (einsatz.value) {
      einsatz.value = { ...einsatz.value, ...updates }
    }
  }

  function clearEinsatz() {
    einsatz.value = null
  }

  return {
    einsatz,
    setEinsatz,
    updateEinsatz,
    clearEinsatz
  }
})

