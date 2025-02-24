<script setup lang="ts">
import { ref, watch } from 'vue'
import { cloneDeep } from 'lodash'
import { orderModel } from '@/models/orderModel.ts'
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

// Watch for changes in the `dialogVisible` prop and synchronize the local state
watch(() => props.dialogVisible,
  (newVal) => {
    localDialogVisible.value = newVal
  },
  { immediate: true }
)

const sendForm = async () => {
  try {
    if (props.orderValues.id) {
      await apiClient.put('api/orders/' + props.orderValues.id, props.orderValues)
    } else {
      await apiClient.post('api/orders', props.orderValues)
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
      <DatePicker v-model="props.orderValues.due_date" dateFormat="dd.mm.yy" :manualInput="false" />
    </div>
    <div class="flex flex-col gap-1 mb-5">
      <label for="customer_name">Customer name</label>
      <InputText v-model="props.orderValues.customer_name" id="customer_name" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex flex-col gap-1 mb-5">
      <label for="customer_address">Customer address</label>
      <InputText v-model="props.orderValues.customer_address" id="customer_address" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="$emit('update:dialogVisible', false)"></Button>
      <Button type="button" label="Save" @click="sendForm"></Button>
    </div>
  </Dialog>

</template>