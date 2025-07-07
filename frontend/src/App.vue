<template>
  <div id="app">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-section">
            <div class="fire-icon">🚒</div>
            <h1 class="app-title">Atemschutzüberwachung</h1>
          </div>
        </div>
        
        <div class="header-right" v-if="einsatzStore.isActive">
          <div class="einsatz-info">
            <div class="einsatz-location">{{ einsatzStore.einsatzort }}</div>
            <div class="einsatz-operator">Bearbeiter: {{ einsatzStore.bearbeiter }}</div>
          </div>
          <div class="current-time">{{ currentTime }}</div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Einsatzbasisdaten Setup -->
      <div v-if="!einsatzStore.isActive" class="setup-container">
        <div class="setup-card">
          <div class="setup-header">
            <h2>Neuer Einsatz</h2>
            <p>Bitte geben Sie die Basisdaten für den Einsatz ein</p>
          </div>
          <EinsatzBasisdaten />
        </div>
      </div>

      <!-- Hauptanwendung -->
      <div v-else class="dashboard-container">
        <!-- Navigation Bar -->
        <nav class="dashboard-nav">
          <div class="nav-left">
            <button 
              @click="showNewEinsatzModal = true"
              class="nav-btn nav-btn-secondary"
            >
              <span class="btn-icon">🔄</span>
              Neuer Einsatz
            </button>
            <button 
              @click="exportData"
              class="nav-btn nav-btn-secondary"
            >
              <span class="btn-icon">📊</span>
              Export
            </button>
          </div>
          
          <div class="nav-right">
            <button 
              @click="showAboutModal = true"
              class="nav-btn nav-btn-info"
            >
              <span class="btn-icon">ℹ️</span>
              Info
            </button>
          </div>
        </nav>

        <!-- Dashboard Content -->
        <div class="dashboard-content">
          <!-- Trupp Management -->
          <div class="trupp-section">
            <div class="section-header">
              <h3>Atemschutztrupps</h3>
              <button 
                @click="showAddTruppModal = true"
                class="btn-primary"
              >
                <span class="btn-icon">➕</span>
                Trupp hinzufügen
              </button>
            </div>
            
            <div class="trupp-dashboard">
              <div class="trupp-list-container">
                <TruppListe />
              </div>
              
              <div class="trupp-details-container" v-if="truppStore.selectedTrupp">
                <TruppDetails />
              </div>
              
              <div class="no-selection" v-else>
                <div class="no-selection-content">
                  <div class="no-selection-icon">👥</div>
                  <h4>Kein Trupp ausgewählt</h4>
                  <p>Wählen Sie einen Trupp aus der Liste aus, um Details anzuzeigen und zu verwalten.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <TruppHinzufuegen 
      v-if="showAddTruppModal" 
      @close="showAddTruppModal = false" 
    />

    <!-- New Einsatz Confirmation Modal -->
    <div v-if="showNewEinsatzModal" class="modal-overlay" @click="showNewEinsatzModal = false">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <h3>Neuen Einsatz starten?</h3>
        </div>
        <div class="modal-body">
          <p>Möchten Sie wirklich einen neuen Einsatz starten? Alle aktuellen Daten gehen verloren.</p>
        </div>
        <div class="modal-actions">
          <button @click="showNewEinsatzModal = false" class="btn-secondary">
            Abbrechen
          </button>
          <button @click="startNewEinsatz" class="btn-danger">
            Neuen Einsatz starten
          </button>
        </div>
      </div>
    </div>

    <!-- About Modal -->
    <div v-if="showAboutModal" class="modal-overlay" @click="showAboutModal = false">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <h3>Über diese Anwendung</h3>
        </div>
        <div class="modal-body">
          <p><strong>Atemschutzüberwachung</strong></p>
          <p>Version 1.0.0</p>
          <p>Eine moderne Webanwendung zur Überwachung von Atemschutztrupps bei Feuerwehreinsätzen.</p>
          <br>
          <p><strong>Funktionen:</strong></p>
          <ul>
            <li>Trupp- und Personenerfassung</li>
            <li>Zeitüberwachung</li>
            <li>Druckwerte-Management</li>
            <li>Statusverfolgung</li>
            <li>Offline-Funktionalität</li>
          </ul>
        </div>
        <div class="modal-actions">
          <button @click="showAboutModal = false" class="btn-primary">
            Schließen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useEinsatzStore } from './stores/einsatz'
import { useTruppStore } from './stores/trupp'
import EinsatzBasisdaten from './components/EinsatzBasisdaten.vue'
import TruppListe from './components/TruppListe.vue'
import TruppDetails from './components/TruppDetails.vue'
import TruppHinzufuegen from './components/TruppHinzufuegen.vue'

const einsatzStore = useEinsatzStore()
const truppStore = useTruppStore()

const currentTime = ref('')
const showAddTruppModal = ref(false)
const showNewEinsatzModal = ref(false)
const showAboutModal = ref(false)

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

function startNewEinsatz() {
  einsatzStore.resetEinsatz()
  truppStore.resetTrupps()
  showNewEinsatzModal.value = false
}

function exportData() {
  // TODO: Implement export functionality
  alert('Export-Funktionalität wird implementiert...')
}
</script>

<style scoped>
/* Global App Styles */
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Styles */
.app-header {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.fire-icon {
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 8px;
}

.app-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.einsatz-info {
  text-align: right;
}

.einsatz-location {
  font-weight: bold;
  font-size: 1.1rem;
}

.einsatz-operator {
  font-size: 0.9rem;
  opacity: 0.9;
}

.current-time {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Setup Container */
.setup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.setup-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
}

.setup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.setup-header h2 {
  color: #dc2626;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.setup-header p {
  color: #6b7280;
  font-size: 1.1rem;
}

/* Dashboard */
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-nav {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left,
.nav-right {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.nav-btn-secondary:hover {
  background: #e5e7eb;
}

.nav-btn-info {
  background: #3b82f6;
  color: white;
}

.nav-btn-info:hover {
  background: #2563eb;
}

.btn-icon {
  font-size: 1rem;
}

/* Dashboard Content */
.dashboard-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.trupp-section {
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.section-header h3 {
  color: #1f2937;
  font-size: 1.5rem;
  margin: 0;
}

.trupp-dashboard {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  min-height: 500px;
}

.trupp-list-container {
  border-right: 2px solid #f3f4f6;
  padding-right: 1.5rem;
}

.trupp-details-container {
  padding-left: 1.5rem;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1.5rem;
}

.no-selection-content {
  text-align: center;
  color: #6b7280;
}

.no-selection-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-selection-content h4 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

/* Buttons */
.btn-primary {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #b91c1c;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body ul {
  margin: 0;
  padding-left: 1.5rem;
}

.modal-body li {
  margin-bottom: 0.5rem;
}

.modal-actions {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  border-top: 1px solid #e5e7eb;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .trupp-dashboard {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .trupp-list-container {
    border-right: none;
    border-bottom: 2px solid #f3f4f6;
    padding-right: 0;
    padding-bottom: 1.5rem;
  }
  
  .trupp-details-container {
    padding-left: 0;
    padding-top: 1.5rem;
  }
  
  .no-selection {
    padding-left: 0;
    padding-top: 1.5rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .app-header {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-right {
    flex-direction: column;
    gap: 1rem;
  }
  
  .dashboard-nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-left,
  .nav-right {
    width: 100%;
    justify-content: center;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>

