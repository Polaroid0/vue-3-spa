<script setup lang="ts">
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
window.toast = useToast()
</script>

<template>
  <Toast />
  <RouterView />
</template>
