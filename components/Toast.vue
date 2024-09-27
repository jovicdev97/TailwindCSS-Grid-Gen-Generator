<template>
  <transition name="fade">
    <div v-if="visible" :class="['toast', `toast-${type}`]">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info'
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const visible = ref(true)
let timeoutId = null

onMounted(() => {
  timeoutId = setTimeout(() => {
    visible.value = false
  }, props.duration)
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  z-index: 9999;
}

.toast-info {
  background-color: #3498db;
}

.toast-success {
  background-color: #2ecc71;
}

.toast-error {
  background-color: #e74c3c;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>