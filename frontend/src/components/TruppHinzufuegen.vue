<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>Neuen Trupp hinzufügen</h3>
        <button @click="$emit('close')" class="close-btn">
          <span>✕</span>
        </button>
      </div>
      
      <form @submit.prevent="addTrupp" class="modal-body">
        <div class="form-section">
          <h4 class="section-title">
            <span class="section-icon">🎯</span>
            Aufgabe
          </h4>
          <div class="form-group">
            <input
              v-model="formData.aufgabe"
              type="text"
              class="form-input"
              placeholder="z.B. Angriffstrupp, Wassertrupp, Sicherheitstrupp"
              required
            />
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">
            <span class="section-icon">👨‍🚒</span>
            Truppführer
          </h4>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Name *</label>
              <input
                v-model="formData.truppfuehrer.name"
                type="text"
                class="form-input"
                placeholder="Name des Truppführers"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Funkrufname</label>
              <input
                v-model="formData.truppfuehrer.funkrufname"
                type="text"
                class="form-input"
                placeholder="z.B. Florian 1-44-1"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">
            <span class="section-icon">👨‍🚒</span>
            Truppmann 1
          </h4>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Name *</label>
              <input
                v-model="formData.truppmann1.name"
                type="text"
                class="form-input"
                placeholder="Name des Truppmann 1"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Funkrufname</label>
              <input
                v-model="formData.truppmann1.funkrufname"
                type="text"
                class="form-input"
                placeholder="z.B. Florian 1-44-2"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <h4 class="section-title">
              <span class="section-icon">👨‍🚒</span>
              Truppmann 2
            </h4>
            <label class="toggle-switch">
              <input
                type="checkbox"
                v-model="hasTruppmann2"
                @change="toggleTruppmann2"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-label">Hinzufügen</span>
            </label>
          </div>
          
          <div v-if="hasTruppmann2" class="form-row">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input
                v-model="formData.truppmann2.name"
                type="text"
                class="form-input"
                placeholder="Name des Truppmann 2"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Funkrufname</label>
              <input
                v-model="formData.truppmann2.funkrufname"
                type="text"
                class="form-input"
                placeholder="z.B. Florian 1-44-3"
              />
            </div>
          </div>
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" @click="$emit('close')" class="btn-secondary">
          <span class="btn-icon">✕</span>
          Abbrechen
        </button>
        <button type="submit" @click="addTrupp" class="btn-primary">
          <span class="btn-icon">➕</span>
          Trupp hinzufügen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTruppStore } from '../stores/trupp'

const emit = defineEmits<{
  close: []
}>()

const truppStore = useTruppStore()

const hasTruppmann2 = ref(false)

const formData = ref({
  aufgabe: '',
  truppfuehrer: {
    name: '',
    funkrufname: ''
  },
  truppmann1: {
    name: '',
    funkrufname: ''
  },
  truppmann2: {
    name: '',
    funkrufname: ''
  }
})

function toggleTruppmann2() {
  if (!hasTruppmann2.value) {
    formData.value.truppmann2 = {
      name: '',
      funkrufname: ''
    }
  }
}

function addTrupp() {
  if (!formData.value.aufgabe || !formData.value.truppfuehrer.name || !formData.value.truppmann1.name) {
    alert('Bitte füllen Sie alle Pflichtfelder aus.')
    return
  }

  const truppData = {
    aufgabe: formData.value.aufgabe,
    truppfuehrer: {
      name: formData.value.truppfuehrer.name,
      funkrufname: formData.value.truppfuehrer.funkrufname || undefined,
      druckwerte: []
    },
    truppmann1: {
      name: formData.value.truppmann1.name,
      funkrufname: formData.value.truppmann1.funkrufname || undefined,
      druckwerte: []
    },
    truppmann2: hasTruppmann2.value && formData.value.truppmann2.name ? {
      name: formData.value.truppmann2.name,
      funkrufname: formData.value.truppmann2.funkrufname || undefined,
      druckwerte: []
    } : undefined
  }

  truppStore.addTrupp(truppData)
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f3f4f6;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.section-icon {
  font-size: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #dc2626;
  background: white;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Toggle Switch */
.toggle-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.toggle-switch input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 3rem;
  height: 1.5rem;
  background: #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background: #dc2626;
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(1.5rem);
}

.toggle-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 2px solid #f3f4f6;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  background: #fafafa;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-primary {
  background: #dc2626;
  color: white;
}

.btn-primary:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-icon {
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .form-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>

