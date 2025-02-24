<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { Dialog } from 'primevue'
import { Button } from 'primevue'
import apiClient from '@/services/api.ts'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'

const props = defineProps<{
  dialogVisible: boolean;
  orderValues: object;
}>()

const emit = defineEmits(['update:dialogVisible', 'update:orderValues'])

// Create a local reactive variable for the dialog visibility
const localDialogVisible = ref(false)

// Local copy of the orderValues prop
const localOrderValues = reactive({ ...props.orderValues })

// Watch for changes in the props and synchronize them locally
watch(
  () => props.dialogVisible,
  (newVal) => {
    localDialogVisible.value = newVal
  },
  { immediate: true }
)

watch(
  () => props.orderValues,
  (newVal) => {
    Object.assign(localOrderValues, newVal) // Sync new incoming prop values
  },
  { immediate: true, deep: true }
)

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Extracts only the date portion in YYYY-MM-DD
};


const sendForm = async () => {
  localOrderValues.due_date = formatDate(localOrderValues.due_date)

  try {
    if (localOrderValues.id) {
      await apiClient.put('api/orders/' + localOrderValues.id, localOrderValues)
    } else {
      await apiClient.post('api/orders', localOrderValues)
    }

    // Reset form values after success
    emit('update:dialogVisible', false)

    window.toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Order created successfully!',
      life: 5000
    })
  } catch (error) {
    window.toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response.data.message,
      life: 5000
    })
  }
}
</script>

<template>
  <Dialog
    v-model:visible="localDialogVisible"
    modal
    header="Create/Edit Order"
    :style="{ width: '25rem' }"
    @update:visible="(value) => $emit('update:dialogVisible', value)"
  >
    <div class="flex flex-col gap-1 mb-4">
      <label for="due_date">Due date</label>
      <DatePicker
        v-model="localOrderValues.due_date"
        dateFormat="dd.mm.yy"
        :manualInput="false"
      />
    </div>
    <div class="flex flex-col gap-1 mb-5">
      <label for="customer_name">Customer name</label>
      <InputText
        v-model="localOrderValues.customer_name"
        id="customer_name"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex flex-col gap-1 mb-5">
      <label for="customer_address">Customer address</label>
      <InputText
        v-model="localOrderValues.customer_address"
        id="customer_address"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="$emit('update:dialogVisible', false)"></Button>
      <Button type="button" label="Save" @click="sendForm"></Button>
    </div>
  </Dialog>
</template>