<template>
  <div class="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow-lg">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-lg">
        <div class="flex items-center gap-3">
          <div class="text-3xl">🚒</div>
          <h1 class="text-2xl sm:text-3xl font-bold">Atemschutzüberwachung</h1>
        </div>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <h2 class="text-xl sm:text-2xl font-bold text-red-600 mb-2">Neuer Einsatz</h2>
        <p class="text-gray-600 mb-6">Bitte geben Sie die Basisdaten für den Einsatz ein</p>

        <form @submit.prevent="startEinsatz" class="space-y-4">
          <!-- Bearbeiter -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              👤 Bearbeiter
            </label>
            <input
              v-model="formData.bearbeiter"
              type="text"
              placeholder="Name des Bearbeiters"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-base"
            />
          </div>

          <!-- Einsatzort -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              📍 Einsatzort
            </label>
            <input
              v-model="formData.einsatzort"
              type="text"
              placeholder="Adresse/Ort des Einsatzes"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-base"
            />
          </div>

          <!-- Einsatzbeginn -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              🕐 Einsatzbeginn
            </label>
            <input
              v-model="formData.einsatzbeginn"
              type="datetime-local"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-base"
            />
          </div>

          <!-- Notizen -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              📝 Notizen (optional)
            </label>
            <textarea
              v-model="formData.notizen"
              placeholder="Zusätzliche Informationen zum Einsatz"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none text-base"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg text-lg"
            >
              🚀 Einsatz starten
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useEinsatzStore } from '../stores/einsatz'

const einsatzStore = useEinsatzStore()

const formData = reactive({
  bearbeiter: '',
  einsatzort: '',
  einsatzbeginn: '',
  notizen: ''
})

function startEinsatz() {
  if (!formData.bearbeiter || !formData.einsatzort || !formData.einsatzbeginn) {
    alert('Bitte füllen Sie alle Pflichtfelder aus.')
    return
  }

  const einsatzData = {
    bearbeiter: formData.bearbeiter,
    einsatzort: formData.einsatzort,
    einsatzbeginn: new Date(formData.einsatzbeginn),
    notizen: formData.notizen
  }

  einsatzStore.startEinsatz(einsatzData)
}

onMounted(() => {
  // Set current date and time as default
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  
  formData.einsatzbeginn = `${year}-${month}-${day}T${hours}:${minutes}`
})
</script>

<style scoped>
/* Ensure proper input sizing on mobile */
input, textarea {
  font-size: 16px; /* Prevents zoom on iOS */
}

@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
}
</style>

