import { ref } from 'vue'

export const useToast = () => {
  const toast = ref(null)

  const showToast = (message, type = 'info') => {
    toast.value = { message, type }
    setTimeout(() => {
      toast.value = null
    }, 3000)
  }

  return {
    toast,
    showToast
  }
}