<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 rounded-t-lg">
        <h3 class="text-lg font-bold flex items-center gap-2">
          📊 Druckwerte eingeben
        </h3>
      </div>

      <!-- Content -->
      <div class="p-6">
        <p class="text-gray-600 mb-4">
          Aktuelle Druckwerte für {{ trupp.aufgabe }}:
        </p>

        <div class="space-y-4">
          <!-- Truppführer -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              👨‍🚒 {{ trupp.truppfuehrer.name }}
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="druckwerte.truppfuehrer"
                type="number"
                min="0"
                max="300"
                step="5"
                placeholder="bar"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <span class="text-gray-500 text-sm">bar</span>
            </div>
          </div>

          <!-- Truppmann 1 -->
          <div v-if="trupp.truppmann1">
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
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <span class="text-gray-500 text-sm">bar</span>
            </div>
          </div>

          <!-- Truppmann 2 -->
          <div v-if="trupp.truppmann2">
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
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <span class="text-gray-500 text-sm">bar</span>
            </div>
          </div>
        </div>

        <!-- Warning for low pressure -->
        <div v-if="hasLowPressure" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">
            ⚠️ <strong>Warnung:</strong> Kritisch niedrige Druckwerte erkannt! Sofortiger Rückzug empfohlen.
          </p>
        </div>

        <!-- Info Box -->
        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800">
            💡 <strong>Hinweis:</strong> Rückzug bei 1/3 des Anfangsdrucks oder spätestens bei 50 bar.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-2 p-4 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ✕ Abbrechen
        </button>
        <button
          @click="save"
          :disabled="!isValid"
          class="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          💾 Speichern
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'

const props = defineProps<{
  trupp: any
}>()

const emit = defineEmits<{
  close: []
  save: [druckwerte: any]
}>()

const druckwerte = reactive({
  truppfuehrer: 0,
  truppmann1: 0,
  truppmann2: 0
})

const isValid = computed(() => {
  const hasValidTruppfuehrer = druckwerte.truppfuehrer >= 0 && druckwerte.truppfuehrer <= 300
  const hasValidTruppmann1 = !props.trupp.truppmann1 || (druckwerte.truppmann1 >= 0 && druckwerte.truppmann1 <= 300)
  const hasValidTruppmann2 = !props.trupp.truppmann2 || (druckwerte.truppmann2 >= 0 && druckwerte.truppmann2 <= 300)
  
  return hasValidTruppfuehrer && hasValidTruppmann1 && hasValidTruppmann2
})

const hasLowPressure = computed(() => {
  return druckwerte.truppfuehrer <= 50 || 
         (props.trupp.truppmann1 && druckwerte.truppmann1 <= 50) ||
         (props.trupp.truppmann2 && druckwerte.truppmann2 <= 50)
})

function save() {
  if (!isValid.value) return
  
  const data = {
    truppfuehrer: druckwerte.truppfuehrer
  }
  
  if (props.trupp.truppmann1) {
    data.truppmann1 = druckwerte.truppmann1
  }
  
  if (props.trupp.truppmann2) {
    data.truppmann2 = druckwerte.truppmann2
  }
  
  emit('save', data)
}

onMounted(() => {
  // Set default values from latest measurement if available
  if (props.trupp.druckmessungen && props.trupp.druckmessungen.length > 0) {
    const latest = props.trupp.druckmessungen[props.trupp.druckmessungen.length - 1]
    druckwerte.truppfuehrer = latest.truppfuehrer || 0
    druckwerte.truppmann1 = latest.truppmann1 || 0
    druckwerte.truppmann2 = latest.truppmann2 || 0
  }
})
</script>

<style scoped>
input[type="number"] {
  font-size: 16px; /* Prevents zoom on iOS */
}
</style>

