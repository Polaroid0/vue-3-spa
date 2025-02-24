<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import { onMounted, ref } from 'vue'
import apiClient from '@/services/api'
import { Button } from 'primevue'
import { Dialog } from 'primevue'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import { cloneDeep } from 'lodash'
import { orderModel } from '@/models/orderModel.ts'

const orders = ref([])
let dialogVisible = ref(false)

const orderValues = ref(cloneDeep(orderModel))

onMounted(async () => {
  await loadOrders()
})

const loadOrders = async () => {
  const response = await apiClient.get('api/orders')
  orders.value = response.data.data
}

const openCreateModal = () => {
  dialogVisible.value = true
}

const sendForm = async () => {
  try {
    await apiClient.post('api/orders', orderValues.value)

    await loadOrders()
    dialogVisible.value = false
    orderValues.value = cloneDeep(orderModel)
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
  <SideBar />
  <Dialog v-model:visible="dialogVisible" modal header="Create Orders" :style="{ width: '25rem' }">
    <div class="flex flex-col gap-1 mb-4">
      <label for="due_date">Due date</label>
      <DatePicker v-model="orderValues.due_date" dateFormat="dd.mm.yy" :manualInput="false" />
    </div>
    <div class="flex flex-col gap-1 mb-5">
      <label for="customer_name">Customer name</label>
      <InputText v-model="orderValues.customer_name" id="customer_name" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex flex-col gap-1 mb-5">
      <label for="customer_address">Customer address</label>
      <InputText v-model="orderValues.customer_address" id="customer_address" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="dialogVisible = false"></Button>
      <Button type="button" label="Save" @click="sendForm"></Button>
    </div>
  </Dialog>
  <div class="p-4 sm:ml-64">
    <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
      <div class="flex justify-end pb-3">
        <Button @click.prevent="openCreateModal">Create</Button>
      </div>
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              ID
            </th>
            <th scope="col" class="px-6 py-3">
              Customer name
            </th>
            <th scope="col" class="px-6 py-3">
              Customer address
            </th>
            <th scope="col" class="px-6 py-3">
              Due date
            </th>
            <th scope="col" class="px-6 py-3">
              Current status
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="order in orders" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ order.id }}
            </th>
            <td class="px-6 py-4">
              {{ order.customer_name }}
            </td>
            <td class="px-6 py-4">
              {{ order.customer_address }}
            </td>
            <td class="px-6 py-4">
              {{ order.due_date }}
            </td>
            <td class="px-6 py-4">
              {{ order.current_status.value }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>