<template>
  <div class="trupp-details">
    <div class="details-header">
      <h3>{{ trupp.aufgabe }}</h3>
      <span :class="['status-badge', `status-${trupp.status}`]">
        {{ getStatusText(trupp.status) }}
      </span>
    </div>
    
    <!-- Trupp Members -->
    <div class="members-section">
      <h4>Truppbesetzung</h4>
      <div class="members-grid">
        <div class="member-card">
          <div class="member-header">
            <strong>Truppführer</strong>
          </div>
          <div class="member-name">{{ trupp.truppfuehrer.name }}</div>
          <div v-if="trupp.truppfuehrer.funkrufname" class="member-funk">
            {{ trupp.truppfuehrer.funkrufname }}
          </div>
        </div>
        
        <div class="member-card">
          <div class="member-header">
            <strong>Truppmann 1</strong>
          </div>
          <div class="member-name">{{ trupp.truppmann1.name }}</div>
          <div v-if="trupp.truppmann1.funkrufname" class="member-funk">
            {{ trupp.truppmann1.funkrufname }}
          </div>
        </div>
        
        <div v-if="trupp.truppmann2" class="member-card">
          <div class="member-header">
            <strong>Truppmann 2</strong>
          </div>
          <div class="member-name">{{ trupp.truppmann2.name }}</div>
          <div v-if="trupp.truppmann2.funkrufname" class="member-funk">
            {{ trupp.truppmann2.funkrufname }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Time Control -->
    <div class="time-section">
      <h4>Zeitüberwachung</h4>
      <div class="time-display">
        <div class="elapsed-time">
          <span class="time-label">Verstrichene Zeit:</span>
          <span class="time-value">{{ formatTime(trupp.elapsedTime) }}</span>
        </div>
        
        <div v-if="trupp.startzeit" class="start-time">
          <span class="time-label">Startzeit:</span>
          <span class="time-value">{{ formatDateTime(trupp.startzeit) }}</span>
        </div>
      </div>
      
      <div class="time-controls">
        <button 
          v-if="!trupp.isRunning && trupp.status === 'bereit'"
          @click="startTrupp"
          class="btn-start"
        >
          Start
        </button>
        
        <button 
          v-if="trupp.isRunning"
          @click="stopTrupp"
          class="btn-stop"
        >
          Stop
        </button>
        
        <button 
          v-if="trupp.isRunning"
          @click="maydayAlert"
          class="btn-mayday"
        >
          MAYDAY
        </button>
      </div>
    </div>
    
    <!-- Status Management -->
    <div class="status-section">
      <h4>Status</h4>
      <div class="status-controls">
        <button 
          v-for="status in availableStatuses"
          :key="status.value"
          @click="updateStatus(status.value)"
          :class="['btn-status', { 'active': trupp.status === status.value }]"
        >
          {{ status.label }}
        </button>
      </div>
    </div>
    
    <!-- Pressure Values -->
    <div class="pressure-section">
      <h4>Druckwerte</h4>
      <button @click="showPressureModal = true" class="btn-pressure">
        Druckwerte eingeben
      </button>
      
      <div v-if="hasPressureValues" class="pressure-display">
        <div class="pressure-member">
          <strong>TF:</strong> 
          <span v-if="trupp.truppfuehrer.druckwerte.length > 0">
            {{ trupp.truppfuehrer.druckwerte[trupp.truppfuehrer.druckwerte.length - 1] }} bar
          </span>
          <span v-else>-</span>
        </div>
        <div class="pressure-member">
          <strong>TM1:</strong>
          <span v-if="trupp.truppmann1.druckwerte.length > 0">
            {{ trupp.truppmann1.druckwerte[trupp.truppmann1.druckwerte.length - 1] }} bar
          </span>
          <span v-else>-</span>
        </div>
        <div v-if="trupp.truppmann2" class="pressure-member">
          <strong>TM2:</strong>
          <span v-if="trupp.truppmann2.druckwerte.length > 0">
            {{ trupp.truppmann2.druckwerte[trupp.truppmann2.druckwerte.length - 1] }} bar
          </span>
          <span v-else>-</span>
        </div>
      </div>
    </div>
    
    <!-- Notes -->
    <div class="notes-section">
      <h4>Notizen</h4>
      <textarea
        v-model="trupp.notizen"
        @input="updateNotes"
        placeholder="Notizen zum Trupp..."
        rows="4"
      ></textarea>
    </div>
    
    <!-- Pressure Input Modal -->
    <div v-if="showPressureModal" class="modal-overlay" @click="showPressureModal = false">
      <div class="modal" @click.stop>
        <h3>Druckwerte eingeben</h3>
        <div class="pressure-form">
          <div class="pressure-input">
            <label>Truppführer (bar):</label>
            <input type="number" v-model.number="pressureForm.truppfuehrer" min="0" max="300" />
          </div>
          <div class="pressure-input">
            <label>Truppmann 1 (bar):</label>
            <input type="number" v-model.number="pressureForm.truppmann1" min="0" max="300" />
          </div>
          <div v-if="trupp.truppmann2" class="pressure-input">
            <label>Truppmann 2 (bar):</label>
            <input type="number" v-model.number="pressureForm.truppmann2" min="0" max="300" />
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showPressureModal = false" class="btn-secondary">Abbrechen</button>
          <button @click="savePressureValues" class="btn-primary">Speichern</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTruppStore } from '../stores/trupp'
import type { Trupp } from '../stores/trupp'

const truppStore = useTruppStore()

const showPressureModal = ref(false)
const pressureForm = ref({
  truppfuehrer: 0,
  truppmann1: 0,
  truppmann2: 0
})

let timeInterval: number | null = null

const trupp = computed(() => truppStore.selectedTrupp as Trupp)

const hasPressureValues = computed(() => {
  return trupp.value.truppfuehrer.druckwerte.length > 0 ||
         trupp.value.truppmann1.druckwerte.length > 0 ||
         (trupp.value.truppmann2 && trupp.value.truppmann2.druckwerte.length > 0)
})

const availableStatuses = [
  { value: 'bereit', label: 'Bereit' },
  { value: 'im_einsatz', label: 'Im Einsatz' },
  { value: 'rueckzug', label: 'Rückzug' },
  { value: 'beendet', label: 'Beendet' }
]

onMounted(() => {
  if (trupp.value.isRunning) {
    startTimeTracking()
  }
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

function startTimeTracking() {
  timeInterval = setInterval(() => {
    if (trupp.value.isRunning && trupp.value.startzeit) {
      const elapsed = Math.floor((Date.now() - trupp.value.startzeit.getTime()) / 1000)
      truppStore.updateElapsedTime(trupp.value.id, elapsed)
    }
  }, 1000)
}

function stopTimeTracking() {
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
}

function startTrupp() {
  truppStore.startTrupp(trupp.value.id)
  startTimeTracking()
}

function stopTrupp() {
  truppStore.stopTrupp(trupp.value.id)
  stopTimeTracking()
}

function updateStatus(status: Trupp['status']) {
  truppStore.updateTruppStatus(trupp.value.id, status)
  
  if (status === 'beendet') {
    stopTimeTracking()
  }
}

function updateNotes() {
  truppStore.updateTrupp(trupp.value.id, { notizen: trupp.value.notizen })
}

function maydayAlert() {
  if (confirm('MAYDAY-Alarm auslösen?\n\nDies wird alle verfügbaren Kräfte alarmieren!')) {
    alert('MAYDAY-ALARM!\n\nTrupp: ' + trupp.value.aufgabe + '\nZeit: ' + new Date().toLocaleTimeString())
    // TODO: Implement proper Mayday protocol
  }
}

function savePressureValues() {
  if (pressureForm.value.truppfuehrer > 0) {
    truppStore.addDruckwert(trupp.value.id, 'truppfuehrer', pressureForm.value.truppfuehrer)
  }
  if (pressureForm.value.truppmann1 > 0) {
    truppStore.addDruckwert(trupp.value.id, 'truppmann1', pressureForm.value.truppmann1)
  }
  if (trupp.value.truppmann2 && pressureForm.value.truppmann2 > 0) {
    truppStore.addDruckwert(trupp.value.id, 'truppmann2', pressureForm.value.truppmann2)
  }
  
  // Reset form
  pressureForm.value = {
    truppfuehrer: 0,
    truppmann1: 0,
    truppmann2: 0
  }
  
  showPressureModal.value = false
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

function formatDateTime(date: Date): string {
  return date.toLocaleString('de-DE')
}
</script>

<style scoped>
.trupp-details {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.details-header h3 {
  color: #1a365d;
  margin: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
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

.members-section,
.time-section,
.status-section,
.pressure-section,
.notes-section {
  margin-bottom: 1.5rem;
}

.members-section h4,
.time-section h4,
.status-section h4,
.pressure-section h4,
.notes-section h4 {
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.member-card {
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.member-header {
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.member-name {
  font-weight: bold;
  color: #1a365d;
}

.member-funk {
  color: #718096;
  font-style: italic;
  font-size: 0.875rem;
}

.time-display {
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.elapsed-time,
.start-time {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.elapsed-time:last-child,
.start-time:last-child {
  margin-bottom: 0;
}

.time-label {
  color: #4a5568;
}

.time-value {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #1a365d;
}

.time-controls {
  display: flex;
  gap: 0.75rem;
}

.btn-start {
  background-color: #38a169;
  color: white;
}

.btn-stop {
  background-color: #e53e3e;
  color: white;
}

.btn-mayday {
  background-color: #d69e2e;
  color: white;
  font-weight: bold;
}

.btn-start,
.btn-stop,
.btn-mayday {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-start:hover,
.btn-stop:hover,
.btn-mayday:hover {
  opacity: 0.9;
}

.status-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-status {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e0;
  background-color: white;
  color: #4a5568;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-status:hover {
  background-color: #f7fafc;
}

.btn-status.active {
  background-color: #3182ce;
  color: white;
  border-color: #3182ce;
}

.btn-pressure {
  background-color: #3182ce;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.pressure-display {
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 6px;
}

.pressure-member {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.pressure-member:last-child {
  margin-bottom: 0;
}

.notes-section textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}

.notes-section textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
}

.modal h3 {
  margin-bottom: 1.5rem;
  color: #1a365d;
  text-align: center;
}

.pressure-form {
  margin-bottom: 1.5rem;
}

.pressure-input {
  margin-bottom: 1rem;
}

.pressure-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2d3748;
}

.pressure-input input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #3182ce;
  color: white;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #2d3748;
}
</style>

