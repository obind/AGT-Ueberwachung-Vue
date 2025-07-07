<template>
  <div class="trupp-liste">
    <div class="header">
      <h3>Trupps</h3>
      <button @click="$emit('addTrupp')" class="btn-add">
        + Trupp hinzufügen
      </button>
    </div>
    
    <div v-if="trupps.length === 0" class="empty-state">
      <p>Noch keine Trupps hinzugefügt.</p>
      <p>Klicken Sie auf "Trupp hinzufügen", um zu beginnen.</p>
    </div>
    
    <div v-else class="trupp-items">
      <div
        v-for="trupp in trupps"
        :key="trupp.id"
        :class="['trupp-item', { 'selected': trupp.id === selectedTruppId, 'active': trupp.isRunning }]"
        @click="selectTrupp(trupp.id)"
      >
        <div class="trupp-header">
          <span class="trupp-aufgabe">{{ trupp.aufgabe }}</span>
          <span :class="['status-badge', `status-${trupp.status}`]">
            {{ getStatusText(trupp.status) }}
          </span>
        </div>
        
        <div class="trupp-members">
          <div class="member">
            <strong>TF:</strong> {{ trupp.truppfuehrer.name }}
            <span v-if="trupp.truppfuehrer.funkrufname" class="funkrufname">
              ({{ trupp.truppfuehrer.funkrufname }})
            </span>
          </div>
          <div class="member">
            <strong>TM1:</strong> {{ trupp.truppmann1.name }}
            <span v-if="trupp.truppmann1.funkrufname" class="funkrufname">
              ({{ trupp.truppmann1.funkrufname }})
            </span>
          </div>
          <div v-if="trupp.truppmann2" class="member">
            <strong>TM2:</strong> {{ trupp.truppmann2.name }}
            <span v-if="trupp.truppmann2.funkrufname" class="funkrufname">
              ({{ trupp.truppmann2.funkrufname }})
            </span>
          </div>
        </div>
        
        <div v-if="trupp.isRunning" class="trupp-time">
          <span class="time-display">{{ formatTime(trupp.elapsedTime) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTruppStore } from '../stores/trupp'

const truppStore = useTruppStore()

const trupps = computed(() => truppStore.trupps)
const selectedTruppId = computed(() => truppStore.selectedTruppId)

const emit = defineEmits<{
  addTrupp: []
}>()

function selectTrupp(id: string) {
  truppStore.selectTrupp(id)
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'bereit': 'Bereit',
    'im_einsatz': 'Im Einsatz',
    'rueckzug': 'Rückzug',
    'beendet': 'Beendet'
  }
  return statusMap[status] || status
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.trupp-liste {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header h3 {
  margin: 0;
  color: #1a365d;
}

.btn-add {
  background-color: #38a169;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-add:hover {
  background-color: #2f855a;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #718096;
}

.trupp-items {
  max-height: 400px;
  overflow-y: auto;
}

.trupp-item {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.trupp-item:hover {
  background-color: #f7fafc;
}

.trupp-item.selected {
  background-color: #ebf8ff;
  border-left: 4px solid #3182ce;
}

.trupp-item.active {
  border-left: 4px solid #38a169;
}

.trupp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.trupp-aufgabe {
  font-weight: bold;
  color: #1a365d;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status-bereit {
  background-color: #e2e8f0;
  color: #2d3748;
}

.status-im_einsatz {
  background-color: #c6f6d5;
  color: #22543d;
}

.status-rueckzug {
  background-color: #fed7d7;
  color: #742a2a;
}

.status-beendet {
  background-color: #e2e8f0;
  color: #4a5568;
}

.trupp-members {
  font-size: 0.9rem;
  color: #4a5568;
}

.member {
  margin-bottom: 0.25rem;
}

.funkrufname {
  color: #718096;
  font-style: italic;
}

.trupp-time {
  margin-top: 0.5rem;
  text-align: right;
}

.time-display {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #38a169;
  font-size: 1.1rem;
}
</style>

