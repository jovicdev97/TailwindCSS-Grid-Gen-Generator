<template>
  <div class="mt-8">
    <h2 class="text-xl font-semibold mb-2">Generierter Tailwind Code:</h2>
    <div class="relative">
      <pre class="bg-gray-100 p-4 rounded overflow-x-auto"><code>{{ gridStore.export() }}</code></pre>
      <button @click="copyToClipboard" class="absolute top-2 right-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
        Kopieren
      </button>
    </div>
  </div>
</template>

<script setup>
import { useGridStore } from '~/stores/grid'

const gridStore = useGridStore()

function copyToClipboard() {
  navigator.clipboard.writeText(gridStore.export()).then(() => {
    alert('Code in die Zwischenablage kopiert!')
  }).catch(err => {
    console.error('Fehler beim Kopieren: ', err)
    alert('Fehler beim Kopieren des Codes. Bitte versuchen Sie es erneut.')
  })
}
</script>
