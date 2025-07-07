<template>
  <div class="einsatz-form">
    <form @submit.prevent="startEinsatz" class="form-container">
      <div class="form-group">
        <label for="bearbeiter" class="form-label">
          <span class="label-icon">👤</span>
          Bearbeiter
        </label>
        <input
          id="bearbeiter"
          v-model="formData.bearbeiter"
          type="text"
          class="form-input"
          placeholder="Name des Bearbeiters"
          required
        />
      </div>

      <div class="form-group">
        <label for="einsatzort" class="form-label">
          <span class="label-icon">📍</span>
          Einsatzort
        </label>
        <input
          id="einsatzort"
          v-model="formData.einsatzort"
          type="text"
          class="form-input"
          placeholder="Adresse/Ort des Einsatzes"
          required
        />
      </div>

      <div class="form-group">
        <label for="einsatzbeginn" class="form-label">
          <span class="label-icon">🕐</span>
          Einsatzbeginn
        </label>
        <input
          id="einsatzbeginn"
          v-model="formData.einsatzbeginn"
          type="datetime-local"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="notizen" class="form-label">
          <span class="label-icon">📝</span>
          Notizen (optional)
        </label>
        <textarea
          id="notizen"
          v-model="formData.notizen"
          class="form-textarea"
          placeholder="Zusätzliche Informationen zum Einsatz"
          rows="4"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-start-einsatz">
          <span class="btn-icon">🚀</span>
          Einsatz starten
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEinsatzStore } from '../stores/einsatz'

const einsatzStore = useEinsatzStore()

const formData = ref({
  bearbeiter: '',
  einsatzort: '',
  einsatzbeginn: '',
  notizen: ''
})

onMounted(() => {
  // Set current date and time as default
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  
  formData.value.einsatzbeginn = `${year}-${month}-${day}T${hours}:${minutes}`
})

function startEinsatz() {
  einsatzStore.startEinsatz({
    bearbeiter: formData.value.bearbeiter,
    einsatzort: formData.value.einsatzort,
    einsatzbeginn: new Date(formData.value.einsatzbeginn),
    notizen: formData.value.notizen
  })
}
</script>

<style scoped>
.einsatz-form {
  width: 100%;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
}

.label-icon {
  font-size: 1.1rem;
}

.form-input,
.form-textarea {
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #fafafa;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #dc2626;
  background: white;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #9ca3af;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.btn-start-einsatz {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.btn-start-einsatz:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
}

.btn-start-einsatz:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-container {
    gap: 1.25rem;
  }
  
  .form-input,
  .form-textarea {
    padding: 0.75rem;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .btn-start-einsatz {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}
</style>

