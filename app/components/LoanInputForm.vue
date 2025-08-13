<script setup lang="ts">
    import { useLoanCalculatorStore } from '../stores/loanCalculator'
    const store = useLoanCalculatorStore()
</script>

<template>
    <form @submit.prevent class="space-y-4">
        <div>
            <label for="loanAmount" class="block text-sm font-medium text-gray-700">Loan amount</label>
            <input
                id="loanAmount"
                type="number"
                v-model.number="store.loanAmount"
                min="100000"
                max="10000000"
                placeholder="100000 - 10000000"
                class="bg-white mt-1 block w-full border rounded-lg px-3 py-2"
            />
        </div>

        <div>
            <label for="termInYears" class="block text-sm font-medium text-gray-700">Loan term in years</label>
            <input
                id="termInYears"
                type="number"
                v-model.number="store.termInYears"
                min="0"
                max="99"
                placeholder="10"
                class="mt-1 block w-full border rounded-lg px-3 py-2 bg-white"
            />
        </div>

        <div class="text-center text-gray-400">Or</div>

        <div>
            <label for="termInMonths" class="block text-sm font-medium text-gray-700">Loan term in months</label>
            <input
                id="termInMonths"
                type="number"
                v-model.number="store.termInMonths"
                min="0"
                max="999"
                placeholder="12"
                class="bg-white mt-1 block w-full border rounded-lg px-3 py-2"
            />
        </div>

        <div>
            <label for="interestRate" class="block text-sm font-medium text-gray-700">Interest rate per year (%)</label>
            <input
                id="interestRate"
                type="number"
                v-model.number="store.interestRate"
                step="0.01"
                min="0"
                max="100"
                placeholder="1.00-20.00"
                class="bg-white mt-1 block w-full border rounded-lg px-3 py-2"
            />
        </div>
    </form>
</template>
