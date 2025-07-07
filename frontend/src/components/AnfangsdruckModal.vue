<template>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
        <h3 class="text-lg font-bold flex items-center gap-2">
          🔧 Anfangsdruck erfassen
        </h3>
      </div>

      <!-- Content -->
      <div class="p-6">
        <p class="text-gray-600 mb-4">
          Bitte geben Sie den Anfangsdruck für alle Atemschutzgeräteträger ein:
        </p>

        <div class="space-y-4">
          <!-- Truppführer -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              👨‍🚒 {{ trupp?.truppfuehrer?.name || 'Truppführer' }}
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="druckwerte.truppfuehrer"
                type="number"
                min="0"
                max="300"
                step="5"
                placeholder="bar"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <span class="text-gray-500 text-sm">bar</span>
            </div>
          </div>

          <!-- Truppmann 1 -->
          <div v-if="trupp?.truppmann1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              👨‍🚒 {{ trupp.truppmann1.name }}
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="druckwerte.truppmann1"
                type="number"
                min="0"
                max="300"
                step="5"
                placeholder="bar"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <span class="text-gray-500 text-sm">bar</span>
            </div>
          </div>

          <!-- Truppmann 2 -->
          <div v-if="trupp?.truppmann2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              👨‍🚒 {{ trupp.truppmann2.name }}
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="druckwerte.truppmann2"
                type="number"
                min="0"
                max="300"
                step="5"
                placeholder="bar"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <span class="text-gray-500 text-sm">bar</span>
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800">
            💡 <strong>Hinweis:</strong> Übliche Anfangsdrücke liegen zwischen 280-300 bar.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-2 p-4 border-t border-gray-200">
        <button
          @click="cancel"
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ✕ Abbrechen
        </button>
        <button
          @click="confirm"
          :disabled="!isValid"
          class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          ✓ Bestätigen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useTruppStore } from '../stores/trupp'

const truppStore = useTruppStore()

const showModal = ref(false)
const trupp = ref(null)
const druckwerte = reactive({
  truppfuehrer: 300,
  truppmann1: 300,
  truppmann2: 300
})

const isValid = computed(() => {
  if (!trupp.value) return false
  
  const hasValidTruppfuehrer = druckwerte.truppfuehrer > 0 && druckwerte.truppfuehrer <= 300
  const hasValidTruppmann1 = !trupp.value.truppmann1 || (druckwerte.truppmann1 > 0 && druckwerte.truppmann1 <= 300)
  const hasValidTruppmann2 = !trupp.value.truppmann2 || (druckwerte.truppmann2 > 0 && druckwerte.truppmann2 <= 300)
  
  return hasValidTruppfuehrer && hasValidTruppmann1 && hasValidTruppmann2
})

function show(truppData) {
  trupp.value = truppData
  showModal.value = true
  
  // Reset values
  druckwerte.truppfuehrer = 300
  druckwerte.truppmann1 = 300
  druckwerte.truppmann2 = 300
}

function cancel() {
  showModal.value = false
  trupp.value = null
}

function confirm() {
  if (!isValid.value || !trupp.value) return
  
  const anfangsdruck = {
    truppfuehrer: druckwerte.truppfuehrer
  }
  
  if (trupp.value.truppmann1) {
    anfangsdruck.truppmann1 = druckwerte.truppmann1
  }
  
  if (trupp.value.truppmann2) {
    anfangsdruck.truppmann2 = druckwerte.truppmann2
  }
  
  // Start the trupp with initial pressure
  truppStore.startTrupp(trupp.value.id, anfangsdruck)
  
  showModal.value = false
  trupp.value = null
}

// Expose the show method to parent components
defineExpose({
  show
})
</script>

<style scoped>
input[type="number"] {
  font-size: 16px; /* Prevents zoom on iOS */
}
</style>

