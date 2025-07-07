<template>
  <div id="app">
    <!-- Einsatzbasisdaten Modal -->
    <EinsatzBasisdaten 
      v-if="!einsatzStarted" 
      @einsatzStarted="onEinsatzStarted"
    />
    
    <!-- Main Application -->
    <div v-if="einsatzStarted" class="main-app">
      <!-- Header -->
      <header class="app-header">
        <div class="header-content">
          <h1>Atemschutzüberwachung</h1>
          <div class="header-info">
            <div class="einsatz-info" v-if="einsatz">
              <span class="einsatzort">{{ einsatz.einsatzort }}</span>
              <span class="bearbeiter">Bearbeiter: {{ einsatz.bearbeiter }}</span>
            </div>
            <div class="current-time">{{ currentTime }}</div>
          </div>
        </div>
        
        <!-- Menu Bar -->
        <nav class="menu-bar">
          <button @click="neuerEinsatz" class="menu-item">Neuer Einsatz</button>
          <button @click="exportData" class="menu-item">Export</button>
          <button @click="showAbout = true" class="menu-item">Über</button>
        </nav>
      </header>
      
      <!-- Main Content -->
      <main class="main-content">
        <div class="content-grid">
          <!-- Left Panel: Trupp Liste -->
          <div class="left-panel">
            <TruppListe @addTrupp="openTruppModal" />
          </div>
          
          <!-- Right Panel: Trupp Details -->
          <div class="right-panel">
            <TruppDetails v-if="selectedTrupp" />
            <div v-else class="no-selection">
              <p>Wählen Sie einen Trupp aus der Liste aus, um Details anzuzeigen.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- Trupp Hinzufügen Modal -->
    <TruppHinzufuegen 
      ref="truppModal" 
      @truppAdded="onTruppAdded"
    />
    
    <!-- About Modal -->
    <div v-if="showAbout" class="modal-overlay" @click="showAbout = false">
      <div class="modal" @click.stop>
        <h2>Über Atemschutzüberwachung</h2>
        <p>Version 1.0.0 (MVP)</p>
        <p>Eine moderne Web-Anwendung zur Überwachung von Atemschutztrupps bei Feuerwehreinsätzen.</p>
        <p>Entwickelt mit Vue.js und TypeScript.</p>
        <button @click="showAbout = false" class="btn-primary">Schließen</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useEinsatzStore } from './stores/einsatz'
import { useTruppStore } from './stores/trupp'
import EinsatzBasisdaten from './components/EinsatzBasisdaten.vue'
import TruppListe from './components/TruppListe.vue'
import TruppHinzufuegen from './components/TruppHinzufuegen.vue'
import TruppDetails from './components/TruppDetails.vue'

const einsatzStore = useEinsatzStore()
const truppStore = useTruppStore()

const einsatzStarted = ref(false)
const currentTime = ref('')
const showAbout = ref(false)
const truppModal = ref<InstanceType<typeof TruppHinzufuegen> | null>(null)

const einsatz = computed(() => einsatzStore.einsatz)
const selectedTrupp = computed(() => truppStore.selectedTrupp)

let timeInterval: number | null = null

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('de-DE')
}

function onEinsatzStarted() {
  einsatzStarted.value = true
}

function openTruppModal() {
  truppModal.value?.openModal()
}

function onTruppAdded() {
  // Trupp was added successfully
}

function neuerEinsatz() {
  if (confirm('Es wird ein neuer Einsatz angelegt.\nNicht gespeicherte Daten gehen unwiderruflich verloren.')) {
    einsatzStore.clearEinsatz()
    truppStore.clearAllTrupps()
    einsatzStarted.value = false
  }
}

function exportData() {
  // TODO: Implement export functionality
  alert('Export-Funktion wird in einer späteren Version implementiert.')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.main-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #1a365d;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.header-content h1 {
  font-size: 1.5rem;
  font-weight: bold;
}

.header-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.einsatz-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.9rem;
}

.einsatzort {
  font-weight: bold;
}

.bearbeiter {
  color: #cbd5e0;
}

.current-time {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  font-weight: bold;
}

.menu-bar {
  background-color: #2c5aa0;
  padding: 0 2rem;
  display: flex;
  gap: 1rem;
}

.menu-item {
  background: none;
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.left-panel, .right-panel {
  min-height: 500px;
}

.no-selection {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  color: #718096;
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
  max-width: 500px;
  text-align: center;
}

.modal h2 {
  margin-bottom: 1rem;
  color: #1a365d;
}

.modal p {
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.btn-primary {
  background-color: #3182ce;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: #2c5aa0;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-info {
    align-items: center;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>

