<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Einsatzbasisdaten Setup -->
    <div v-if="!einsatzStore.isActive" class="w-full">
      <EinsatzBasisdaten />
    </div>
    
    <!-- Hauptanwendung Dashboard -->
    <div v-else class="w-full min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div class="w-full px-4 py-3">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="flex items-center gap-3">
              <div class="text-2xl">🚒</div>
              <div>
                <h1 class="text-xl sm:text-2xl font-bold">Atemschutzüberwachung</h1>
                <div class="text-sm opacity-90">{{ einsatzStore.einsatzort }}</div>
              </div>
            </div>
            <div class="flex flex-col sm:items-end text-sm">
              <div class="font-medium">Bearbeiter: {{ einsatzStore.bearbeiter }}</div>
              <div class="font-mono">{{ currentTime }}</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="bg-white border-b border-gray-200 shadow-sm">
        <div class="w-full px-4 py-2">
          <div class="flex flex-wrap gap-2">
            <button 
              @click="resetEinsatz"
              class="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
            >
              🔄 Neuer Einsatz
            </button>
            <button 
              @click="exportData"
              class="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
            >
              📊 Export
            </button>
            <button 
              @click="showInfo"
              class="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm"
            >
              ℹ️ Info
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 w-full">
        <div class="w-full h-full">
          <div class="flex flex-col lg:flex-row h-full">
            <!-- Trupp Liste -->
            <div class="w-full lg:w-1/2 xl:w-2/5">
              <TruppListe />
            </div>
            
            <!-- Trupp Details -->
            <div class="w-full lg:w-1/2 xl:w-3/5 border-l border-gray-200">
              <TruppDetails />
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <TruppHinzufuegen />
    <AnfangsdruckModal />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useEinsatzStore } from './stores/einsatz'
import EinsatzBasisdaten from './components/EinsatzBasisdaten.vue'
import TruppListe from './components/TruppListe.vue'
import TruppDetails from './components/TruppDetails.vue'
import TruppHinzufuegen from './components/TruppHinzufuegen.vue'
import AnfangsdruckModal from './components/AnfangsdruckModal.vue'

const einsatzStore = useEinsatzStore()
const currentTime = ref('')
let timeInterval: number | null = null

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('de-DE')
}

function resetEinsatz() {
  if (confirm('Möchten Sie wirklich einen neuen Einsatz starten? Alle aktuellen Daten gehen verloren.')) {
    einsatzStore.resetEinsatz()
  }
}

function exportData() {
  // TODO: Implement export functionality
  alert('Export-Funktionalität wird implementiert')
}

function showInfo() {
  alert('Atemschutzüberwachung v1.0\nEntwickelt für die Feuerwehr')
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

/* Responsive utilities */
@media (max-width: 640px) {
  .text-2xl {
    font-size: 1.25rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
}
</style>

