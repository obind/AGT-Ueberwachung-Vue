<template>
  <div class="h-full bg-white flex flex-col">
    <!-- Header -->
    <div class="bg-gray-50 border-b border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 class="text-lg font-semibold text-gray-900">Atemschutztrupps</h2>
        <button
          @click="truppStore.showAddModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
        >
          ➕ Trupp hinzufügen
        </button>
      </div>
    </div>

    <!-- Active Trupps Section -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium text-gray-900">Aktive Trupps</h3>
          <span class="text-sm text-gray-500">{{ truppStore.aktiveTrupps.length }} Trupps</span>
        </div>

        <!-- Active Trupps List -->
        <div v-if="truppStore.aktiveTrupps.length > 0" class="space-y-3 mb-6">
          <div
            v-for="trupp in truppStore.aktiveTrupps"
            :key="trupp.id"
            @click="truppStore.selectTrupp(trupp.id)"
            :class="[
              'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md',
              truppStore.selectedTruppId === trupp.id 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-medium text-gray-900">{{ trupp.aufgabe }}</h4>
                  <span :class="statusClasses[trupp.status]" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ statusLabels[trupp.status] }}
                  </span>
                </div>
                <div class="text-sm text-gray-600">
                  {{ trupp.truppfuehrer.name }}
                  <span v-if="trupp.truppmann1">, {{ trupp.truppmann1.name }}</span>
                  <span v-if="trupp.truppmann2">, {{ trupp.truppmann2.name }}</span>
                </div>
              </div>
              
              <div class="flex flex-col sm:items-end gap-1">
                <div v-if="trupp.laufendeZeit" class="font-mono font-bold text-lg" :class="getTimeColor(trupp.laufendeZeit)">
                  {{ truppStore.formatTime(trupp.laufendeZeit) }}
                </div>
                <div v-if="getLatestPressure(trupp)" class="text-xs text-gray-500">
                  Min: {{ getLatestPressure(trupp) }} bar
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All Trupps Section -->
        <div class="border-t border-gray-200 pt-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-gray-900">Alle Trupps</h3>
            <span class="text-sm text-gray-500">{{ truppStore.trupps.length }} Trupps</span>
          </div>

          <!-- Empty State -->
          <div v-if="truppStore.trupps.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">👥</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Noch keine Trupps hinzugefügt</h3>
            <p class="text-gray-500 mb-4">Klicken Sie auf "Trupp hinzufügen", um zu beginnen.</p>
            <button
              @click="truppStore.showAddModal = true"
              class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              ➕ Trupp hinzufügen
            </button>
          </div>

          <!-- Trupps List -->
          <div v-else class="space-y-2">
            <div
              v-for="trupp in truppStore.trupps"
              :key="trupp.id"
              @click="truppStore.selectTrupp(trupp.id)"
              :class="[
                'p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm',
                truppStore.selectedTruppId === trupp.id 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-medium text-gray-900 text-sm">{{ trupp.aufgabe }}</h4>
                    <span :class="statusClasses[trupp.status]" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ statusLabels[trupp.status] }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-600">
                    {{ trupp.truppfuehrer.name }}
                    <span v-if="trupp.truppmann1">, {{ trupp.truppmann1.name }}</span>
                    <span v-if="trupp.truppmann2">, {{ trupp.truppmann2.name }}</span>
                  </div>
                </div>
                
                <div class="text-right">
                  <div v-if="trupp.laufendeZeit && (trupp.status === 'im_einsatz' || trupp.status === 'rueckzug')" 
                       class="font-mono font-medium text-sm" :class="getTimeColor(trupp.laufendeZeit)">
                    {{ truppStore.formatTime(trupp.laufendeZeit) }}
                  </div>
                  <div v-else-if="trupp.einsatzdauer" class="font-mono text-xs text-gray-500">
                    {{ trupp.einsatzdauer }}min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTruppStore } from '../stores/trupp'

const truppStore = useTruppStore()

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

function getTimeColor(seconds: number): string {
  const minutes = seconds / 60
  if (minutes >= 30) return 'text-red-600'
  if (minutes >= 20) return 'text-yellow-600'
  return 'text-green-600'
}

function getLatestPressure(trupp: any): number | null {
  const latest = truppStore.getLatestDruckwerte(trupp.id)
  if (!latest) return null
  
  const pressures = []
  if (latest.truppfuehrer) pressures.push(latest.truppfuehrer)
  if (latest.truppmann1) pressures.push(latest.truppmann1)
  if (latest.truppmann2) pressures.push(latest.truppmann2)
  
  return pressures.length > 0 ? Math.min(...pressures) : null
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>

