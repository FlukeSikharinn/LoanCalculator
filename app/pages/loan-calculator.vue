<script setup lang="ts">
  import { ref } from 'vue'

  const showSchedule = ref(false)
</script>

<template>
  <div class="mx-auto w-full max-w-6xl mt-4">
    <div
      class="bg-white rounded-xs shadow-lg overflow-hidden flex flex-col lg:flex-row border border-gray-300"
    >
      <div class="w-full lg:w-1/2 bg-gray-50 p-6">
        <LoanInputForm />
      </div>
      <div class="w-full lg:w-1/2 p-6 text-center">
        <client-only>
          <LoanSummary />
        </client-only>
        <div class="space-y-2">
          <button
            class="mt-2 cursor-pointer border-2 transition duration-100 block w-full py-2 font-semibold rounded-lg border-blue-600 text-blue-600 hover:bg-blue-50"
            @click="showSchedule = !showSchedule"
          >
            {{ showSchedule ? 'Hide amortization schedule' : 'Show amortization schedule' }}
          </button>
        </div>
      </div>
    </div>

    <client-only>
      <div v-if="showSchedule" class="bg-white rounded-xs mt-5 shadow-lg overflow-hidden p-6 border border-gray-300">
        <LoanCharts />
      </div>
      <AmortizationTable v-if="showSchedule" />
    </client-only>
  </div>
</template>
