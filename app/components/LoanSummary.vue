<script setup lang="ts">
    import { useLoanCalculatorStore } from '../stores/loanCalculator'
    import { useFormat } from '../composables/useFormat'

    const store = useLoanCalculatorStore()
    const { formatCurrency } = useFormat()
</script>

<template>
    <div class="text-center">
        <p class="mb-2 text-gray-600">Monthly payments</p>
        <p class="text-3xl font-semibold mb-4">
            {{ store.result.payment ? formatCurrency(store.result.payment) : '—' }}
        </p>

        <div class="flex justify-between border-b pb-2 mb-2 text-sm">
            <span>Total principal paid</span>
            <span>{{ formatCurrency(store.loanAmount) }}</span>
        </div>

        <div class="flex justify-between text-sm mb-2">
            <span>Total interest paid</span>
            <span>{{ store.result.totalInterest ? formatCurrency(store.result.totalInterest) : '—' }}</span>
        </div>

        <div class="flex justify-between text-sm mb-4 font-bold">
            <span>Total amount paid</span>
            <span>{{ store.result.payment ? formatCurrency(store.loanAmount + (store.result.totalInterest || 0)) : '—' }}</span>
        </div>

        <div class="mb-2">
            <label for="startDate" class="block text-sm font-medium text-gray-700">Start date</label>
            <input
                id="startDate"
                type="date"
                v-model="store.startDate"
                class="bg-white mt-1 block w-full border rounded-lg px-3 py-2 mb-3"
            />
        </div>
    </div>
</template>
