import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TruppMember {
  name: string
  funkrufname?: string
  druckwerte: number[]
  timestamps: Date[]
}

export interface Trupp {
  id: string
  aufgabe: string
  truppfuehrer: TruppMember
  truppmann1: TruppMember
  truppmann2?: TruppMember
  startzeit?: Date
  endzeit?: Date
  status: 'bereit' | 'im_einsatz' | 'rueckzug' | 'beendet'
  notizen: string
  isRunning: boolean
  elapsedTime: number
}

export const useTruppStore = defineStore('trupp', () => {
  const trupps = ref<Trupp[]>([])
  const selectedTruppId = ref<string | null>(null)

  // Computed
  const selectedTrupp = computed(() => {
    if (!selectedTruppId.value) return null
    return trupps.value.find(t => t.id === selectedTruppId.value) || null
  })

  const activeTrupps = computed(() => {
    return trupps.value.filter(t => t.status === 'im_einsatz' || t.status === 'rueckzug')
  })

  // Actions
  function addTrupp(trupp: Omit<Trupp, 'id'>) {
    const newTrupp: Trupp = {
      ...trupp,
      id: Date.now().toString(),
    }
    trupps.value.push(newTrupp)
    return newTrupp.id
  }

  function updateTrupp(id: string, updates: Partial<Trupp>) {
    const index = trupps.value.findIndex(t => t.id === id)
    if (index !== -1) {
      trupps.value[index] = { ...trupps.value[index], ...updates }
    }
  }

  function deleteTrupp(id: string) {
    const index = trupps.value.findIndex(t => t.id === id)
    if (index !== -1) {
      trupps.value.splice(index, 1)
      if (selectedTruppId.value === id) {
        selectedTruppId.value = null
      }
    }
  }

  function selectTrupp(id: string) {
    selectedTruppId.value = id
  }

  function startTrupp(id: string) {
    const trupp = trupps.value.find(t => t.id === id)
    if (trupp && trupp.status === 'bereit') {
      trupp.startzeit = new Date()
      trupp.status = 'im_einsatz'
      trupp.isRunning = true
    }
  }

  function stopTrupp(id: string) {
    const trupp = trupps.value.find(t => t.id === id)
    if (trupp && trupp.isRunning) {
      trupp.endzeit = new Date()
      trupp.status = 'beendet'
      trupp.isRunning = false
    }
  }

  function updateTruppStatus(id: string, status: Trupp['status']) {
    const trupp = trupps.value.find(t => t.id === id)
    if (trupp) {
      trupp.status = status
      if (status === 'beendet') {
        trupp.isRunning = false
        trupp.endzeit = new Date()
      }
    }
  }

  function addDruckwert(truppId: string, member: 'truppfuehrer' | 'truppmann1' | 'truppmann2', druckwert: number) {
    const trupp = trupps.value.find(t => t.id === truppId)
    if (trupp && trupp[member]) {
      trupp[member]!.druckwerte.push(druckwert)
      trupp[member]!.timestamps.push(new Date())
    }
  }

  function updateElapsedTime(id: string, elapsedTime: number) {
    const trupp = trupps.value.find(t => t.id === id)
    if (trupp) {
      trupp.elapsedTime = elapsedTime
    }
  }

  function clearAllTrupps() {
    trupps.value = []
    selectedTruppId.value = null
  }

  return {
    trupps,
    selectedTruppId,
    selectedTrupp,
    activeTrupps,
    addTrupp,
    updateTrupp,
    deleteTrupp,
    selectTrupp,
    startTrupp,
    stopTrupp,
    updateTruppStatus,
    addDruckwert,
    updateElapsedTime,
    clearAllTrupps
  }
})

