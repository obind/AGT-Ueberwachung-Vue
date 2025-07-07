<template>
  <div class="trupp-hinzufuegen">
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h2>Trupp hinzufügen</h2>
        <form @submit.prevent="submitTrupp">
          <div class="form-group">
            <label for="aufgabe">Aufgabe:</label>
            <input
              type="text"
              id="aufgabe"
              v-model="formData.aufgabe"
              required
              placeholder="z.B. Angriffstrupp, Wassertrupp"
            />
          </div>
          
          <div class="form-group">
            <label for="truppfuehrer">Truppführer:</label>
            <input
              type="text"
              id="truppfuehrer"
              v-model="formData.truppfuehrer.name"
              required
              placeholder="Name des Truppführers"
            />
          </div>
          
          <div class="form-group">
            <label for="truppfuehrer-funk">Funkrufname Truppführer (optional):</label>
            <input
              type="text"
              id="truppfuehrer-funk"
              v-model="formData.truppfuehrer.funkrufname"
              placeholder="z.B. Florian 1-44-1"
            />
          </div>
          
          <div class="form-group">
            <label for="truppmann1">Truppmann 1:</label>
            <input
              type="text"
              id="truppmann1"
              v-model="formData.truppmann1.name"
              required
              placeholder="Name des Truppmann 1"
            />
          </div>
          
          <div class="form-group">
            <label for="truppmann1-funk">Funkrufname Truppmann 1 (optional):</label>
            <input
              type="text"
              id="truppmann1-funk"
              v-model="formData.truppmann1.funkrufname"
              placeholder="z.B. Florian 1-44-2"
            />
          </div>
          
          <div class="form-group">
            <label>
              <input
                type="checkbox"
                v-model="hasTruppmann2"
              />
              Truppmann 2 hinzufügen
            </label>
          </div>
          
          <div v-if="hasTruppmann2" class="truppmann2-section">
            <div class="form-group">
              <label for="truppmann2">Truppmann 2:</label>
              <input
                type="text"
                id="truppmann2"
                v-model="formData.truppmann2.name"
                placeholder="Name des Truppmann 2"
              />
            </div>
            
            <div class="form-group">
              <label for="truppmann2-funk">Funkrufname Truppmann 2 (optional):</label>
              <input
                type="text"
                id="truppmann2-funk"
                v-model="formData.truppmann2.funkrufname"
                placeholder="z.B. Florian 1-44-3"
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Abbrechen</button>
            <button type="submit" class="btn-primary">Trupp hinzufügen</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTruppStore } from '../stores/trupp'
import type { TruppMember } from '../stores/trupp'

const truppStore = useTruppStore()

const showModal = ref(false)
const hasTruppmann2 = ref(false)

const formData = ref({
  aufgabe: '',
  truppfuehrer: {
    name: '',
    funkrufname: '',
    druckwerte: [],
    timestamps: []
  } as TruppMember,
  truppmann1: {
    name: '',
    funkrufname: '',
    druckwerte: [],
    timestamps: []
  } as TruppMember,
  truppmann2: {
    name: '',
    funkrufname: '',
    druckwerte: [],
    timestamps: []
  } as TruppMember
})

const emit = defineEmits<{
  truppAdded: []
}>()

function openModal() {
  showModal.value = true
  resetForm()
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function resetForm() {
  formData.value = {
    aufgabe: '',
    truppfuehrer: {
      name: '',
      funkrufname: '',
      druckwerte: [],
      timestamps: []
    },
    truppmann1: {
      name: '',
      funkrufname: '',
      druckwerte: [],
      timestamps: []
    },
    truppmann2: {
      name: '',
      funkrufname: '',
      druckwerte: [],
      timestamps: []
    }
  }
  hasTruppmann2.value = false
}

function submitTrupp() {
  if (formData.value.aufgabe && formData.value.truppfuehrer.name && formData.value.truppmann1.name) {
    const truppData = {
      aufgabe: formData.value.aufgabe,
      truppfuehrer: formData.value.truppfuehrer,
      truppmann1: formData.value.truppmann1,
      truppmann2: hasTruppmann2.value && formData.value.truppmann2.name ? formData.value.truppmann2 : undefined,
      status: 'bereit' as const,
      notizen: '',
      isRunning: false,
      elapsedTime: 0
    }
    
    truppStore.addTrupp(truppData)
    closeModal()
    emit('truppAdded')
  }
}

defineExpose({
  openModal
})
</script>

<style scoped>
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin-bottom: 1.5rem;
  color: #1a365d;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2d3748;
}

.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.truppmann2-section {
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  background-color: #f7fafc;
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3182ce;
  color: white;
}

.btn-primary:hover {
  background-color: #2c5aa0;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}
</style>

