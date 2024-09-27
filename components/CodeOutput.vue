<template>
  <div class="mb-4">
    <h2 class="text-xl font-semibold mb-2">Generated Tailwind Code:</h2>
    <pre class="bg-gray-100 p-4 rounded"><code>{{ gridStore.export() }}</code></pre>
    <button @click="copyToClipboard" class="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
      Copy Code
    </button>
  </div>
</template>

<script setup>
import { useGridStore } from '~/stores/grid'

const gridStore = useGridStore()

function copyToClipboard() {
  navigator.clipboard.writeText(gridStore.export()).then(() => {
    alert('Code copied to clipboard!')
  })
}
</script>
