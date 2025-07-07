<template>
  <div class="einsatz-basisdaten">
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h2>Einsatzbasisdaten</h2>
        <form @submit.prevent="submitEinsatz">
          <div class="form-group">
            <label for="bearbeiter">Bearbeiter:</label>
            <input
              type="text"
              id="bearbeiter"
              v-model="formData.bearbeiter"
              required
              placeholder="Name des Bearbeiters"
            />
          </div>
          
          <div class="form-group">
            <label for="einsatzort">Einsatzort:</label>
            <input
              type="text"
              id="einsatzort"
              v-model="formData.einsatzort"
              required
              placeholder="Adresse/Ort des Einsatzes"
            />
          </div>
          
          <div class="form-group">
            <label for="einsatzbeginn">Einsatzbeginn:</label>
            <input
              type="datetime-local"
              id="einsatzbeginn"
              v-model="formData.einsatzbeginn"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="notizen">Notizen (optional):</label>
            <textarea
              id="notizen"
              v-model="formData.notizen"
              placeholder="Zusätzliche Informationen zum Einsatz"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary">Einsatz starten</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEinsatzStore } from '../stores/einsatz'

const einsatzStore = useEinsatzStore()

const showModal = ref(true)
const formData = ref({
  bearbeiter: '',
  einsatzort: '',
  einsatzbeginn: '',
  notizen: ''
})

const emit = defineEmits<{
  einsatzStarted: []
}>()

onMounted(() => {
  // Set current date and time as default
  const now = new Date()
  formData.value.einsatzbeginn = now.toISOString().slice(0, 16)
})

function submitEinsatz() {
  if (formData.value.bearbeiter && formData.value.einsatzort && formData.value.einsatzbeginn) {
    einsatzStore.setEinsatz({
      bearbeiter: formData.value.bearbeiter,
      einsatzort: formData.value.einsatzort,
      einsatzbeginn: new Date(formData.value.einsatzbeginn),
      notizen: formData.value.notizen || undefined
    })
    
    showModal.value = false
    emit('einsatzStarted')
  }
}
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
  max-width: 500px;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.form-actions {
  margin-top: 1.5rem;
  text-align: center;
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
}

.btn-primary:hover {
  background-color: #2c5aa0;
}
</style>

