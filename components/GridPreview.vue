<template>
  <div class="mb-4">
    <h2 class="text-xl font-semibold mb-2">Grid Preview:</h2>
    <div class="border border-gray-300 p-4" v-html="sanitizedHtml"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGridStore } from '~/stores/grid'
import DOMPurify from 'dompurify'

const gridStore = useGridStore()

const sanitizedHtml = computed(() => {
  const html = gridStore.export()
  return DOMPurify.sanitize(html)
})
</script>