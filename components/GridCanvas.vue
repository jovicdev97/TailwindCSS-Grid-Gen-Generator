<template>
  <div class="flex flex-col items-center">
    <!-- Grid Controls -->
    <div class="flex items-center justify-between w-full p-4 bg-gray-100 shadow-md">
      <div class="flex items-center">
        <!-- Input for Columns and Rows -->
        <label class="mr-4">
          Columns:
          <input v-model.number="columns" type="number" min="1" class="ml-2 p-1 border rounded" />
        </label>
        <label>
          Rows:
          <input v-model.number="rows" type="number" min="1" class="ml-2 p-1 border rounded" />
        </label>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="clearGrid" class="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          Clear Grid
        </button>
      </div>
    </div>

    <!-- Grid Area -->
    <div 
      class="grid-container relative mt-4 w-full" 
      ref="gridContainer"
      @mousedown="startDrawing" 
      @mousemove="drawBox" 
      @mouseup="finishDrawing"
      @mouseleave="finishDrawing"
      :style="gridContainerStyle"
    >
      <!-- Grid Lines -->
      <div v-for="col in columns" :key="'col-' + col"
           :style="{ left: `${col * columnWidth}px` }"
           class="grid-line vertical"></div>
      <div v-for="row in rows" :key="'row-' + row"
           :style="{ top: `${row * rowHeight}px` }"
           class="grid-line horizontal"></div>

      <!-- Grid Boxes -->
      <GridBox v-for="box in gridStore.boxes" :key="box.id" :box="box" />

      <!-- Preview Box -->
      <div v-if="previewBox" :style="previewBoxStyle" class="preview-box"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGridStore } from '~/stores/grid'
import GridBox from './GridBox.vue'

const gridStore = useGridStore()

const columnWidth = ref(80)
const rowHeight = ref(60)

const columns = ref(10) // default
const rows = ref(8) // default

const gridContainer = ref(null)

const isDrawing = ref(false)
const startX = ref(0)
const startY = ref(0)
const previewBox = ref(null)

const gridContainerStyle = computed(() => ({
  width: '100%',
  height: `${columns.value * rowHeight.value}px`, 
  position: 'relative',
  border: '1px solid #ccc',
  backgroundColor: '#f9f9f9'
}))

const previewBoxStyle = computed(() => {
  if (!previewBox.value) return {}
  return {
    left: `${previewBox.value.startX}px`,
    top: `${previewBox.value.startY}px`,
    width: `${previewBox.value.width}px`,
    height: `${previewBox.value.height}px`,
  }
})

function startDrawing(event) {
  isDrawing.value = true
  const rect = gridContainer.value.getBoundingClientRect()
  startX.value = Math.floor((event.clientX - rect.left) / columnWidth.value) * columnWidth.value
  startY.value = Math.floor((event.clientY - rect.top) / rowHeight.value) * rowHeight.value
}

function drawBox(event) {
  if (!isDrawing.value) return
  
  const rect = gridContainer.value.getBoundingClientRect()
  const currentX = Math.ceil((event.clientX - rect.left) / columnWidth.value) * columnWidth.value
  const currentY = Math.ceil((event.clientY - rect.top) / rowHeight.value) * rowHeight.value

  const width = Math.abs(currentX - startX.value)
  const height = Math.abs(currentY - startY.value)

  previewBox.value = {
    startX: Math.min(startX.value, currentX),
    startY: Math.min(startY.value, currentY),
    width,
    height
  }
}

function finishDrawing() {
  if (!isDrawing.value) return

  isDrawing.value = false
  if (previewBox.value && previewBox.value.width > 0 && previewBox.value.height > 0) {
    gridStore.addBox({
      ...previewBox.value,
      id: Date.now(),
    })
    previewBox.value = null
  }
}

function clearGrid() {
  gridStore.clear()
  alert('Grid cleared')
}

onMounted(() => {
  window.addEventListener('mouseup', finishDrawing)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', finishDrawing)
})
</script>

<style scoped>
.grid-container {
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.grid-line {
  position: absolute;
  background-color: #e0e0e0;
}

.grid-line.vertical {
  width: 1px;
  height: 100%;
}

.grid-line.horizontal {
  height: 1px;
  width: 100%;
}

.preview-box {
  position: absolute;
  border: 2px dashed #3B82F6;
  background-color: rgba(59, 130, 246, 0.2);
}
</style>
