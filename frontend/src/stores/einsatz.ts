import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Einsatz {
  bearbeiter: string
  einsatzbeginn: Date
  einsatzort: string
  notizen?: string
}

export const useEinsatzStore = defineStore('einsatz', () => {
  const einsatz = ref<Einsatz | null>(null)

  const isActive = computed(() => einsatz.value !== null)
  const bearbeiter = computed(() => einsatz.value?.bearbeiter || '')
  const einsatzort = computed(() => einsatz.value?.einsatzort || '')

  function startEinsatz(einsatzData: Einsatz) {
    einsatz.value = einsatzData
  }

  function setEinsatz(einsatzData: Einsatz) {
    einsatz.value = einsatzData
  }

  function updateEinsatz(updates: Partial<Einsatz>) {
    if (einsatz.value) {
      einsatz.value = { ...einsatz.value, ...updates }
    }
  }

  function resetEinsatz() {
    einsatz.value = null
  }

  function clearEinsatz() {
    einsatz.value = null
  }

  return {
    einsatz,
    isActive,
    bearbeiter,
    einsatzort,
    startEinsatz,
    setEinsatz,
    updateEinsatz,
    resetEinsatz,
    clearEinsatz
  }
})
