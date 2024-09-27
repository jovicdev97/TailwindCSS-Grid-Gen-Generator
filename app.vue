<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <div>
        <NuxtPage />
        <Toast v-if="toast" :message="toast.message" :type="toast.type" />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { provide } from 'vue'
import Toast from '~/components/Toast.vue'
import { useToast } from '~/composables/useToast'

const { toast, showToast } = useToast()
provide('toast', { toast, showToast })
</script>