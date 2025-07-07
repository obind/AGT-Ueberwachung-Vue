<template>
  <div class="h-full bg-white">
    <div v-if="!truppStore.selectedTrupp" class="h-full flex flex-col items-center justify-center p-8 text-center">
      <div class="text-6xl mb-4">👥</div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">Kein Trupp ausgewählt</h3>
      <p class="text-gray-500">Wählen Sie einen Trupp aus der Liste aus, um Details anzuzeigen und zu verwalten.</p>
    </div>

    <div v-else class="h-full flex flex-col">
      <!-- Header -->
      <div class="bg-gray-50 border-b border-gray-200 p-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ trupp.aufgabe }}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span :class="statusClasses[trupp.status]" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ statusLabels[trupp.status] }}
              </span>
              <span v-if="trupp.laufendeZeit && (trupp.status === 'im_einsatz' || trupp.status === 'rueckzug')" 
                    class="font-mono text-sm font-medium text-gray-700">
                {{ truppStore.formatTime(trupp.laufendeZeit) }}
              </span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
              v-if="trupp.status === 'bereit'"
              @click="startTrupp"
              class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
            >
              ▶️ Start
            </button>
            
            <button
              v-if="trupp.status === 'im_einsatz'"
              @click="setStatus('rueckzug')"
              class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors"
            >
              🔄 Rückzug
            </button>
            
            <button
              v-if="trupp.status === 'im_einsatz' || trupp.status === 'rueckzug'"
              @click="setStatus('beendet')"
              class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              ⏹️ Beenden
            </button>
            
            <button
              @click="deleteTrupp"
              class="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              🗑️ Löschen
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-6">
        <!-- Personal Information -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            👥 Personal
          </h4>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">Truppführer:</span>
              <span>{{ trupp.truppfuehrer.name }}</span>
              <span v-if="trupp.truppfuehrer.funkrufname" class="text-gray-500 text-sm">
                ({{ trupp.truppfuehrer.funkrufname }})
              </span>
            </div>
            <div v-if="trupp.truppmann1" class="flex items-center gap-2">
              <span class="font-medium text-gray-700">Truppmann 1:</span>
              <span>{{ trupp.truppmann1.name }}</span>
              <span v-if="trupp.truppmann1.funkrufname" class="text-gray-500 text-sm">
                ({{ trupp.truppmann1.funkrufname }})
              </span>
            </div>
            <div v-if="trupp.truppmann2" class="flex items-center gap-2">
              <span class="font-medium text-gray-700">Truppmann 2:</span>
              <span>{{ trupp.truppmann2.name }}</span>
              <span v-if="trupp.truppmann2.funkrufname" class="text-gray-500 text-sm">
                ({{ trupp.truppmann2.funkrufname }})
              </span>
            </div>
          </div>
        </div>

        <!-- Time Information -->
        <div v-if="trupp.startzeit" class="bg-blue-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            ⏱️ Zeiten
          </h4>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">Startzeit:</span>
              <span class="font-mono">{{ formatDateTime(trupp.startzeit) }}</span>
            </div>
            <div v-if="trupp.laufendeZeit" class="flex items-center gap-2">
              <span class="font-medium text-gray-700">Laufende Zeit:</span>
              <span class="font-mono text-lg font-bold" :class="getTimeColor(trupp.laufendeZeit)">
                {{ truppStore.formatTime(trupp.laufendeZeit) }}
              </span>
            </div>
            <div v-if="trupp.endzeit" class="flex items-center gap-2">
              <span class="font-medium text-gray-700">Endzeit:</span>
              <span class="font-mono">{{ formatDateTime(trupp.endzeit) }}</span>
            </div>
            <div v-if="trupp.einsatzdauer" class="flex items-center gap-2">
              <span class="font-medium text-gray-700">Gesamtdauer:</span>
              <span class="font-mono">{{ trupp.einsatzdauer }} Minuten</span>
            </div>
          </div>
        </div>

        <!-- Pressure Values -->
        <div class="bg-orange-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold text-gray-900 flex items-center gap-2">
              🔧 Druckwerte
            </h4>
            <button
              v-if="trupp.status === 'im_einsatz' || trupp.status === 'rueckzug'"
              @click="showDruckModal = true"
              class="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
            >
              📊 Druckwerte eingeben
            </button>
          </div>
          
          <div v-if="latestDruckwerte" class="space-y-2">
            <div class="text-sm text-gray-600 mb-2">
              Letzte Messung: {{ formatDateTime(latestDruckwerte.zeitpunkt) }}
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div v-if="latestDruckwerte.truppfuehrer" class="bg-white p-2 rounded border">
                <div class="text-xs text-gray-500">Truppführer</div>
                <div class="font-mono font-bold" :class="getPressureColor(latestDruckwerte.truppfuehrer)">
                  {{ latestDruckwerte.truppfuehrer }} bar
                </div>
              </div>
              <div v-if="latestDruckwerte.truppmann1" class="bg-white p-2 rounded border">
                <div class="text-xs text-gray-500">Truppmann 1</div>
                <div class="font-mono font-bold" :class="getPressureColor(latestDruckwerte.truppmann1)">
                  {{ latestDruckwerte.truppmann1 }} bar
                </div>
              </div>
              <div v-if="latestDruckwerte.truppmann2" class="bg-white p-2 rounded border">
                <div class="text-xs text-gray-500">Truppmann 2</div>
                <div class="font-mono font-bold" :class="getPressureColor(latestDruckwerte.truppmann2)">
                  {{ latestDruckwerte.truppmann2 }} bar
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-gray-500 text-sm">
            Noch keine Druckwerte erfasst
          </div>
        </div>

        <!-- Notes -->
        <div class="bg-yellow-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            📝 Notizen
          </h4>
          <textarea
            v-model="notizen"
            @blur="updateNotizen"
            placeholder="Notizen zum Trupp..."
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
          ></textarea>
        </div>

        <!-- Pressure History -->
        <div v-if="trupp.druckmessungen.length > 1" class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            📈 Druckverlauf
          </h4>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="(messung, index) in trupp.druckmessungen.slice().reverse()"
              :key="index"
              class="bg-white p-2 rounded border text-sm"
            >
              <div class="font-mono text-xs text-gray-500 mb-1">
                {{ formatDateTime(messung.zeitpunkt) }}
              </div>
              <div class="flex gap-4">
                <span v-if="messung.truppfuehrer">TF: {{ messung.truppfuehrer }}bar</span>
                <span v-if="messung.truppmann1">TM1: {{ messung.truppmann1 }}bar</span>
                <span v-if="messung.truppmann2">TM2: {{ messung.truppmann2 }}bar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pressure Input Modal -->
    <DruckwerteModal
      v-if="showDruckModal"
      :trupp="trupp"
      @close="showDruckModal = false"
      @save="saveDruckwerte"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTruppStore } from '../stores/trupp'
import DruckwerteModal from './DruckwerteModal.vue'

const truppStore = useTruppStore()
const showDruckModal = ref(false)
const notizen = ref('')

const trupp = computed(() => truppStore.selectedTrupp)
const latestDruckwerte = computed(() => 
  trupp.value ? truppStore.getLatestDruckwerte(trupp.value.id) : null
)

const statusLabels = {
  'bereit': 'Bereit',
  'im_einsatz': 'Im Einsatz',
  'rueckzug': 'Rückzug',
  'beendet': 'Beendet'
}

const statusClasses = {
  'bereit': 'bg-gray-100 text-gray-800',
  'im_einsatz': 'bg-green-100 text-green-800',
  'rueckzug': 'bg-yellow-100 text-yellow-800',
  'beendet': 'bg-red-100 text-red-800'
}

watch(trupp, (newTrupp) => {
  if (newTrupp) {
    notizen.value = newTrupp.notizen || ''
  }
}, { immediate: true })

function startTrupp() {
  if (!trupp.value) return
  
  // Show initial pressure modal
  const anfangsdruckModal = document.querySelector('anfangsdruck-modal')
  if (anfangsdruckModal) {
    anfangsdruckModal.show(trupp.value)
  } else {
    // Fallback: start without pressure input
    truppStore.startTrupp(trupp.value.id, {
      truppfuehrer: 300,
      truppmann1: trupp.value.truppmann1 ? 300 : undefined,
      truppmann2: trupp.value.truppmann2 ? 300 : undefined
    })
  }
}

function setStatus(status: string) {
  if (!trupp.value) return
  truppStore.setTruppStatus(trupp.value.id, status)
}

function deleteTrupp() {
  if (!trupp.value) return
  
  if (confirm(`Möchten Sie den Trupp "${trupp.value.aufgabe}" wirklich löschen?`)) {
    truppStore.deleteTrupp(trupp.value.id)
  }
}

function updateNotizen() {
  if (!trupp.value) return
  truppStore.updateNotizen(trupp.value.id, notizen.value)
}

function saveDruckwerte(druckwerte: any) {
  if (!trupp.value) return
  truppStore.addDruckmessung(trupp.value.id, druckwerte)
  showDruckModal.value = false
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTimeColor(seconds: number): string {
  const minutes = seconds / 60
  if (minutes >= 30) return 'text-red-600'
  if (minutes >= 20) return 'text-yellow-600'
  return 'text-green-600'
}

function getPressureColor(pressure: number): string {
  if (pressure <= 50) return 'text-red-600'
  if (pressure <= 100) return 'text-yellow-600'
  return 'text-green-600'
}
</script>

<style scoped>
/* Custom scrollbar for pressure history */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>

