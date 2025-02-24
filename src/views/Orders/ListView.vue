<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import { onMounted, ref } from 'vue'
import apiClient from '@/services/api'
import { Button } from 'primevue'
import OrdersFormView from '@/views/Orders/FormView.vue'
import { orderModel } from '@/models/orderModel.ts'
import { cloneDeep } from 'lodash'

const orders = ref([])
let dialogVisible = ref(false)
let orderValues = ref(orderModel)

onMounted(async () => {
  await loadOrders()
})

const loadOrders = async () => {
  const response = await apiClient.get('api/orders')
  orders.value = response.data.data
}

const openModal = async (ID) => {
  orderValues.value = cloneDeep(orderModel)
  if (ID) {
    const response = await apiClient.get('api/orders/' + ID)
    orderValues.value = response.data.data
  }
  dialogVisible.value = true
}

</script>

<template>
  <SideBar />
  <OrdersFormView v-model:dialogVisible="dialogVisible" v-model:order-values="orderValues"/>
  <div class="p-4 sm:ml-64">
    <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
      <div class="flex justify-end pb-3">
        <Button @click.prevent="openModal()">Create</Button>
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
            <th scope="col" class="px-6 py-3">
              Action
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
            <td class="px-6 py-4">
              <a href="#" @click.prevent="openModal(order.id)">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                </svg>
              </a>
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