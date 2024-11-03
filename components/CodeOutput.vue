<template>
  <section class="mt-8" aria-labelledby="code-output-title">
    <h2 id="code-output-title" class="text-xl font-semibold mb-2">
      Generierter Tailwind Code:
    </h2>
    <div class="relative">
      <pre 
        class="bg-gray-100 p-4 rounded overflow-x-auto min-h-[4rem] max-h-[24rem]"
      ><code>{{ gridStore.export() }}</code></pre>
      <button
        type="button"
        @click="handleCopy"
        class="absolute top-2 right-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
        :disabled="isCopying"
        aria-label="Code kopieren"
      >
        {{ copyButtonText }}
      </button>
    </div>
    <div
      v-if="showCopyStatus"
      class="mt-2 text-sm text-green-600"
      role="status"
      aria-live="polite"
    >
      {{ copyStatusText }}
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useGridStore } from '~/stores/grid'

const gridStore = useGridStore()
const isCopying = ref(false)
const showCopyStatus = ref(false)
const copyButtonText = ref('Kopieren')
const copyStatusText = ref('')

const handleCopy = async () => {
  if (isCopying.value) return
  
  isCopying.value = true
  copyButtonText.value = 'Kopiere...'
  
  try {
    await navigator.clipboard.writeText(gridStore.export())
    copyStatusText.value = 'Code wurde in die Zwischenablage kopiert!'
    showCopyStatus.value = true
    copyButtonText.value = 'Kopiert!'
    
    setTimeout(() => {
      showCopyStatus.value = false
      copyButtonText.value = 'Kopieren'
      isCopying.value = false
    }, 2000)
  } catch (error) {
    console.error('Clipboard error:', error)
    copyStatusText.value = 'Fehler beim Kopieren. Bitte erneut versuchen.'
    showCopyStatus.value = true
    copyButtonText.value = 'Kopieren'
    isCopying.value = false
    
    setTimeout(() => {
      showCopyStatus.value = false
    }, 3000)
  }
}
</script>