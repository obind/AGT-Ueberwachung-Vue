<template>
  <div v-if="truppStore.showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg sticky top-0">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold">Neuen Trupp hinzufügen</h3>
          <button
            @click="closeModal"
            class="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Content -->
      <form @submit.prevent="addTrupp" class="p-6 space-y-6">
        <!-- Aufgabe -->
        <div>
          <h4 class="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            🎯 Aufgabe
          </h4>
          <input
            v-model="formData.aufgabe"
            type="text"
            placeholder="z.B. Angriffstrupp, Wassertrupp, Sicherheitstrupp"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
        </div>

        <!-- Truppführer -->
        <div>
          <h4 class="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            👨‍🚒 Truppführer
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                v-model="formData.truppfuehrer.name"
                type="text"
                placeholder="Name des Truppführers"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Funkrufname</label>
              <input
                v-model="formData.truppfuehrer.funkrufname"
                type="text"
                placeholder="z.B. Florian 1-44-1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Truppmann 1 -->
        <div>
          <h4 class="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            👨‍🚒 Truppmann 1
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                v-model="formData.truppmann1.name"
                type="text"
                placeholder="Name des Truppmann 1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Funkrufname</label>
              <input
                v-model="formData.truppmann1.funkrufname"
                type="text"
                placeholder="z.B. Florian 1-44-2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Truppmann 2 -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h4 class="flex items-center gap-2 text-lg font-semibold text-gray-900">
              👨‍🚒 Truppmann 2
            </h4>
            <button
              type="button"
              @click="toggleTruppmann2"
              class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              {{ showTruppmann2 ? 'Entfernen' : 'Hinzufügen' }}
            </button>
          </div>
          
          <div v-if="showTruppmann2" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                v-model="formData.truppmann2.name"
                type="text"
                placeholder="Name des Truppmann 2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Funkrufname</label>
              <input
                v-model="formData.truppmann2.funkrufname"
                type="text"
                placeholder="z.B. Florian 1-44-3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ✕ Abbrechen
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            ➕ Trupp hinzufügen
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useTruppStore } from '../stores/trupp'

const truppStore = useTruppStore()
const showTruppmann2 = ref(false)

const formData = reactive({
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

const isFormValid = computed(() => {
  return formData.aufgabe.trim() !== '' &&
         formData.truppfuehrer.name.trim() !== '' &&
         formData.truppmann1.name.trim() !== ''
})

function toggleTruppmann2() {
  showTruppmann2.value = !showTruppmann2.value
  if (!showTruppmann2.value) {
    formData.truppmann2.name = ''
    formData.truppmann2.funkrufname = ''
  }
}

function closeModal() {
  truppStore.showAddModal = false
  resetForm()
}

function resetForm() {
  formData.aufgabe = ''
  formData.truppfuehrer.name = ''
  formData.truppfuehrer.funkrufname = ''
  formData.truppmann1.name = ''
  formData.truppmann1.funkrufname = ''
  formData.truppmann2.name = ''
  formData.truppmann2.funkrufname = ''
  showTruppmann2.value = false
}

function addTrupp() {
  if (!isFormValid.value) return

  const truppData = {
    aufgabe: formData.aufgabe.trim(),
    truppfuehrer: {
      name: formData.truppfuehrer.name.trim(),
      funkrufname: formData.truppfuehrer.funkrufname.trim() || undefined
    },
    truppmann1: {
      name: formData.truppmann1.name.trim(),
      funkrufname: formData.truppmann1.funkrufname.trim() || undefined
    },
    truppmann2: showTruppmann2.value && formData.truppmann2.name.trim() ? {
      name: formData.truppmann2.name.trim(),
      funkrufname: formData.truppmann2.funkrufname.trim() || undefined
    } : undefined
  }

  truppStore.addTrupp(truppData)
  closeModal()
}
</script>

<style scoped>
input {
  font-size: 16px; /* Prevents zoom on iOS */
}

@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>

