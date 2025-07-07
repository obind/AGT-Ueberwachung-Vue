<template>
  <div class="trupp-liste">
    <div class="liste-header">
      <h4>Aktive Trupps</h4>
      <div class="trupp-count">{{ trupps.length }} Trupp{{ trupps.length !== 1 ? 's' : '' }}</div>
    </div>
    
    <div v-if="trupps.length === 0" class="empty-state">
      <div class="empty-icon">👥</div>
      <p>Noch keine Trupps hinzugefügt</p>
      <small>Klicken Sie auf "Trupp hinzufügen", um zu beginnen.</small>
    </div>
    
    <div v-else class="trupp-cards">
      <div
        v-for="trupp in trupps"
        :key="trupp.id"
        @click="selectTrupp(trupp)"
        :class="[
          'trupp-card',
          { 'selected': selectedTrupp?.id === trupp.id },
          `status-${trupp.status}`
        ]"
      >
        <div class="card-header">
          <div class="trupp-title">{{ trupp.aufgabe }}</div>
          <div :class="['status-badge', `status-${trupp.status}`]">
            {{ getStatusText(trupp.status) }}
          </div>
        </div>
        
        <div class="card-content">
          <div class="member-info">
            <div class="member">
              <span class="member-role">TF:</span>
              <span class="member-name">{{ trupp.truppfuehrer.name }}</span>
            </div>
            <div class="member">
              <span class="member-role">TM1:</span>
              <span class="member-name">{{ trupp.truppmann1.name }}</span>
            </div>
            <div v-if="trupp.truppmann2" class="member">
              <span class="member-role">TM2:</span>
              <span class="member-name">{{ trupp.truppmann2.name }}</span>
            </div>
          </div>
          
          <div class="time-info" v-if="trupp.isRunning || trupp.elapsedTime > 0">
            <div class="time-display">
              <span class="time-icon">⏱️</span>
              <span class="time-value">{{ formatTime(trupp.elapsedTime) }}</span>
            </div>
            <div v-if="trupp.startzeit" class="start-time">
              Gestartet: {{ formatStartTime(trupp.startzeit) }}
            </div>
          </div>
        </div>
        
        <div class="card-footer" v-if="hasPressureData(trupp)">
          <div class="pressure-summary">
            <span class="pressure-icon">🔧</span>
            <span class="pressure-text">Druckwerte erfasst</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTruppStore } from '../stores/trupp'
import type { Trupp } from '../stores/trupp'

const truppStore = useTruppStore()

const trupps = computed(() => truppStore.trupps)
const selectedTrupp = computed(() => truppStore.selectedTrupp)

function selectTrupp(trupp: Trupp) {
  truppStore.selectTrupp(trupp.id)
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

function formatStartTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

function hasPressureData(trupp: Trupp): boolean {
  return trupp.truppfuehrer.druckwerte.length > 0 ||
         trupp.truppmann1.druckwerte.length > 0 ||
         (trupp.truppmann2 && trupp.truppmann2.druckwerte.length > 0)
}
</script>

<style scoped>
.trupp-liste {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.liste-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f3f4f6;
}

.liste-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.trupp-count {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #6b7280;
  flex: 1;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  color: #374151;
}

.empty-state small {
  font-size: 0.875rem;
}

.trupp-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  overflow-y: auto;
}

.trupp-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.trupp-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.trupp-card.selected {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  background: #fef2f2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.trupp-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-bereit {
  background: #f3f4f6;
  color: #374151;
}

.status-im_einsatz {
  background: #dcfce7;
  color: #166534;
}

.status-rueckzug {
  background: #fef3c7;
  color: #92400e;
}

.status-beendet {
  background: #e5e7eb;
  color: #6b7280;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.member {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.member-role {
  font-weight: 600;
  color: #6b7280;
  min-width: 2.5rem;
}

.member-name {
  color: #374151;
}

.time-info {
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #dc2626;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.time-icon {
  font-size: 0.875rem;
}

.time-value {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #dc2626;
  font-size: 0.875rem;
}

.start-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.card-footer {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.pressure-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.pressure-icon {
  font-size: 0.875rem;
}

/* Status-specific card styling */
.trupp-card.status-im_einsatz {
  border-left: 4px solid #16a34a;
}

.trupp-card.status-rueckzug {
  border-left: 4px solid #d97706;
}

.trupp-card.status-beendet {
  opacity: 0.7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .trupp-card {
    padding: 0.875rem;
  }
  
  .card-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .member {
    font-size: 0.8rem;
  }
  
  .time-info {
    padding: 0.5rem;
  }
}
</style>

