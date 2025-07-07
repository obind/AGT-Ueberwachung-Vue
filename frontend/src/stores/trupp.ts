import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Person {
  name: string
  funkrufname?: string
}

export interface DruckMessung {
  zeitpunkt: Date
  truppfuehrer?: number
  truppmann1?: number
  truppmann2?: number
}

export interface Trupp {
  id: string
  aufgabe: string
  truppfuehrer: Person
  truppmann1?: Person
  truppmann2?: Person
  status: 'bereit' | 'im_einsatz' | 'rueckzug' | 'beendet'
  startzeit?: Date
  endzeit?: Date
  anfangsdruck?: DruckMessung
  druckmessungen: DruckMessung[]
  notizen?: string
  einsatzdauer?: number // in Minuten
  laufendeZeit?: number // in Sekunden für Live-Timer
}

export const useTruppStore = defineStore('trupp', () => {
  const trupps = ref<Trupp[]>([])
  const selectedTruppId = ref<string | null>(null)
  const showAddModal = ref(false)
  
  // Live timer intervals
  const timerIntervals = ref<Map<string, number>>(new Map())

  const selectedTrupp = computed(() => 
    trupps.value.find(t => t.id === selectedTruppId.value) || null
  )

  const aktiveTrupps = computed(() => 
    trupps.value.filter(t => t.status === 'im_einsatz' || t.status === 'rueckzug')
  )

  function addTrupp(truppData: Omit<Trupp, 'id' | 'status' | 'druckmessungen' | 'laufendeZeit'>) {
    const trupp: Trupp = {
      ...truppData,
      id: Date.now().toString(),
      status: 'bereit',
      druckmessungen: [],
      laufendeZeit: 0
    }
    trupps.value.push(trupp)
    return trupp.id
  }

  function startTrupp(truppId: string, anfangsdruck: any) {
    const trupp = trupps.value.find(t => t.id === truppId)
    if (!trupp) return

    const now = new Date()
    trupp.status = 'im_einsatz'
    trupp.startzeit = now
    trupp.laufendeZeit = 0
    trupp.anfangsdruck = {
      zeitpunkt: now,
      ...anfangsdruck
    }
    trupp.druckmessungen = [trupp.anfangsdruck]

    // Start live timer
    startLiveTimer(truppId)
  }

  function startLiveTimer(truppId: string) {
    // Clear existing timer if any
    stopLiveTimer(truppId)
    
    const interval = setInterval(() => {
      const trupp = trupps.value.find(t => t.id === truppId)
      if (trupp && (trupp.status === 'im_einsatz' || trupp.status === 'rueckzug')) {
        trupp.laufendeZeit = (trupp.laufendeZeit || 0) + 1
      } else {
        stopLiveTimer(truppId)
      }
    }, 1000)
    
    timerIntervals.value.set(truppId, interval)
  }

  function stopLiveTimer(truppId: string) {
    const interval = timerIntervals.value.get(truppId)
    if (interval) {
      clearInterval(interval)
      timerIntervals.value.delete(truppId)
    }
  }

  function stopTrupp(truppId: string) {
    const trupp = trupps.value.find(t => t.id === truppId)
    if (!trupp) return

    trupp.status = 'beendet'
    trupp.endzeit = new Date()
    
    if (trupp.startzeit) {
      trupp.einsatzdauer = Math.floor((trupp.endzeit.getTime() - trupp.startzeit.getTime()) / 60000)
    }

    stopLiveTimer(truppId)
  }

  function setTruppStatus(truppId: string, status: Trupp['status']) {
    const trupp = trupps.value.find(t => t.id === truppId)
    if (!trupp) return

    const oldStatus = trupp.status
    trupp.status = status

    // Handle timer based on status
    if (status === 'im_einsatz' && oldStatus === 'bereit') {
      // This should be handled by startTrupp instead
      return
    } else if (status === 'rueckzug' && oldStatus === 'im_einsatz') {
      // Continue timer for Rückzug
    } else if (status === 'beendet') {
      stopTrupp(truppId)
    }
  }

  function addDruckmessung(truppId: string, druckwerte: any) {
    const trupp = trupps.value.find(t => t.id === truppId)
    if (!trupp) return

    const messung: DruckMessung = {
      zeitpunkt: new Date(),
      ...druckwerte
    }
    trupp.druckmessungen.push(messung)
  }

  function updateNotizen(truppId: string, notizen: string) {
    const trupp = trupps.value.find(t => t.id === truppId)
    if (trupp) {
      trupp.notizen = notizen
    }
  }

  function selectTrupp(truppId: string | null) {
    selectedTruppId.value = truppId
  }

  function deleteTrupp(truppId: string) {
    stopLiveTimer(truppId)
    const index = trupps.value.findIndex(t => t.id === truppId)
    if (index > -1) {
      trupps.value.splice(index, 1)
      if (selectedTruppId.value === truppId) {
        selectedTruppId.value = null
      }
    }
  }

  function clearAllTrupps() {
    // Stop all timers
    timerIntervals.value.forEach((interval) => clearInterval(interval))
    timerIntervals.value.clear()
    
    trupps.value = []
    selectedTruppId.value = null
  }

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  }

  function getLatestDruckwerte(truppId: string) {
    const trupp = trupps.value.find(t => t.id === truppId)
    if (!trupp || trupp.druckmessungen.length === 0) return null
    
    return trupp.druckmessungen[trupp.druckmessungen.length - 1]
  }

  return {
    trupps,
    selectedTruppId,
    selectedTrupp,
    aktiveTrupps,
    showAddModal,
    addTrupp,
    startTrupp,
    stopTrupp,
    setTruppStatus,
    addDruckmessung,
    updateNotizen,
    selectTrupp,
    deleteTrupp,
    clearAllTrupps,
    formatTime,
    getLatestDruckwerte
  }
})

