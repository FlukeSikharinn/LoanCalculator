<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { useLoanCalculatorStore } from '../stores/loanCalculator'

    import { useFormat } from '../composables/useFormat'

    const store = useLoanCalculatorStore()
    const { formatCurrency } = useFormat()

    const form = ref({
        amount: null as number | null,
        months: null as number | null,
        years: null as number | null,
        rate: null as number | null,
        start: new Date().toISOString().split('T')[0]
    })

    function addLoan() {
        if (
            !form.value.amount ||
            (!form.value.months && !form.value.years) ||
            !form.value.rate
        ) {
            return
        }
        const months = form.value.months ?? form.value.years * 12
        store.addLoan(form.value.amount, months, form.value.rate, form.value.start)
        form.value = {
            amount: null,
            months: null,
            years: null,
            rate: null,
            start: new Date().toISOString().split('T')[0]
        }
    }

    const maxInterest = computed(() => {
        if (store.loans.length === 0) return null
        return Math.max(...store.loans.map(loan => loan.totalInterest ?? 0))
    })

    const minInterest = computed(() => {
        if (store.loans.length === 0) return null
        return Math.min(...store.loans.map(loan => loan.totalInterest ?? 0))
    })

    watch(() => form.value.years, (val) => {
        if (val) form.value.months = null
    })
    watch(() => form.value.months, (val) => {
        if (val) form.value.years = null
    })

</script>

<template>
    <div>
        <div
            class="bg-white rounded-xs shadow-lg overflow-hidden flex flex-col lg:flex-row border border-gray-300 mt-4"
        >
            <div class="w-full lg:px-30 lg:py-10 bg-gray-50 p-6">
                <form @submit.prevent="addLoan" class="space-y-4">
                    <div>
                        <label for="loanAmount" class="block text-sm font-medium text-gray-700">Loan amount</label>
                        <input
                            id="loanAmount"
                            type="number"
                            v-model.number="form.amount"
                            min="1000"
                            placeholder="100000 - 10000000"
                            class="bg-white mt-1 block w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label for="termYears" class="block text-sm font-medium text-gray-700">
                            Loan term (years)
                        </label>
                        <input
                            id="termYears"
                            type="number"
                            v-model.number="form.years"
                            min="1"
                            max="99"
                            placeholder="10"
                            class="mt-1 block w-full border rounded-lg px-3 py-2 bg-white"
                        />
                    </div>

                    <div class="text-center text-gray-400">Or</div>

                    <div>
                        <label for="termMonths" class="block text-sm font-medium text-gray-700">
                            Loan term (months)
                        </label>
                        <input
                            id="termMonths"
                            type="number"
                            v-model.number="form.months"
                            min="1"
                            max="600"
                            placeholder="120"
                            class="mt-1 block w-full border rounded-lg px-3 py-2 bg-white"
                        />
                    </div>

                    <div>
                        <label for="interestRate" class="block text-sm font-medium text-gray-700">Interest rate per year (%)</label>
                        <input
                            id="interestRate"
                            type="number"
                            v-model.number="form.rate"
                            step="0.01"
                            min="0"
                            max="100"
                            placeholder="1.00-20.00"
                            class="bg-white mt-1 block w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <button
                    type="submit"
                    class="mt-6 cursor-pointer border-2 transition duration-100 block w-full py-2 font-semibold rounded-lg border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                    :disabled="store.loans.length >= 5"
                    >
                        Add to comparison
                    </button>
                </form>
            </div>
        </div>
        <div class="bg-white rounded-xs mt-5 shadow-lg overflow-hidden p-6 border border-gray-300 mb-10">
            <div class="text-center">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-xl font-bold">Loan Comparison</h4>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm border border-gray-300 rounded-lg overflow-hidden table-fixed">
                        <thead class="bg-gray-100 border-b border-gray-300">
                        <tr>
                            <th v-if="store.loans.length > 0" class="px-4 py-3 text-left border-r border-gray-300">Detail</th>
                            <th
                            v-for="(loan, index) in store.loans"
                            :key="index"
                            class="px-4 py-3 text-center border-r border-gray-300 whitespace-nowrap"
                            >
                            Loan {{ index + 1 }}
                            <button
                                @click="store.removeLoan(index)"
                                class="ml-2 text-red-600 hover:text-red-800 transition rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                                title="Remove loan"
                                aria-label="Remove loan"
                            >
                                ❌
                            </button>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="store.loans.length === 0">
                            <td colspan="100%" class="text-center py-6 text-gray-500 italic bg-gray-50">
                                No loan data added yet.
                            </td>
                        </tr>
                            <template v-else>
                                <tr class="even:bg-gray-50">
                                    <td class="px-4 py-3 font-semibold border-r border-gray-300">Loan Amount</td>
                                    <td
                                        v-for="loan in store.loans"
                                        :key="'amount' + loan.amount"
                                        class="px-4 py-3 text-center border-r border-gray-300"
                                    >
                                        {{ formatCurrency(loan.amount) }}
                                    </td>
                                </tr>
                                <tr class="even:bg-gray-50">
                                    <td class="px-4 py-3 font-semibold border-r border-gray-300">Loan Term (Months)</td>
                                    <td
                                        v-for="loan in store.loans"
                                        :key="'months' + loan.months"
                                        class="px-4 py-3 text-center border-r border-gray-300"
                                    >
                                        {{ loan.months }}
                                    </td>
                                </tr>
                                <tr class="even:bg-gray-50">
                                    <td class="px-4 py-3 font-semibold border-r border-gray-300">Interest Rate (%)</td>
                                    <td
                                        v-for="loan in store.loans"
                                        :key="'rate' + loan.rate"
                                        class="px-4 py-3 text-center border-r border-gray-300"
                                    >
                                        {{ loan.rate }}
                                    </td>
                                </tr>
                                <tr class="even:bg-gray-50">
                                    <td class="px-4 py-3 font-semibold border-r border-gray-300">Monthly Payment</td>
                                    <td
                                        v-for="loan in store.loans"
                                        :key="'payment' + loan.payment"
                                        class="px-4 py-3 text-center border-r border-gray-300"
                                    >
                                        {{ formatCurrency(loan.payment) }}
                                    </td>
                                </tr>
                                <tr class="even:bg-gray-50">
                                    <td class="px-4 py-3 font-semibold border-r border-gray-300">Annual Payment</td>
                                    <td
                                        v-for="loan in store.loans"
                                        :key="'annualPayment' + loan.payment"
                                        class="px-4 py-3 text-center border-r border-gray-300"
                                    >
                                        {{
                                        loan.payment && loan.months
                                            ? formatCurrency((loan.payment * 12))
                                            : '-'
                                        }}
                                    </td>
                                </tr>
                                <tr class="even:bg-gray-50">
                                    <td class="px-4 py-3 font-semibold border-r border-gray-300">Total Payment</td>
                                    <td
                                        v-for="loan in store.loans"
                                        :key="'totalPayment' + loan.payment"
                                        class="px-4 py-3 text-center border-r border-gray-300"
                                    >
                                        {{
                                        loan.payment && loan.months
                                            ? formatCurrency((loan.payment * loan.months))
                                            : '-'
                                        }}
                                    </td>
                                </tr>
                                <tr class="even:bg-gray-50">
                                    <td class="px-4 py-3 font-semibold border-r border-gray-300">Total Interest</td>
                                    <td
                                        v-for="loan in store.loans"
                                        :key="'totalInterest' + loan.totalInterest"
                                        class="px-4 py-3 text-center border-r border-gray-300"
                                        :class="{
                                        'text-red-600 font-bold': loan.totalInterest === maxInterest,
                                        'text-green-600 font-bold': loan.totalInterest === minInterest
                                        }"
                                    >
                                        {{ formatCurrency(loan.totalInterest) }}
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</template>
