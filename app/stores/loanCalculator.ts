import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useLoanCalculatorStore = defineStore('loanCalculator', () => {
    const loanAmount = ref<number | null>(null)
    const termInYears = ref<number | null>(null)
    const termInMonths = ref<number | null>(null)
    const interestRate = ref<number | null>(null)
    const startDate = ref<string>(new Date().toISOString().split('T')[0])

    const result = ref({
        payment: null as number | null,
        totalInterest: null as number | null,
        schedule: [] as any[],
    })

    const loans = ref<Array<any>>([])

    function calculate(
        amount?: number,
        months?: number,
        rate?: number,
        start?: string
    ) {
        const loanAmt = amount ?? loanAmount.value
        const termMonths = months ?? (termInYears.value ? termInYears.value * 12 : termInMonths.value ?? 0)
        const intRate = rate ?? interestRate.value
        const startDt = start ?? startDate.value

        if (!loanAmt || !intRate || !termMonths) {
        if (amount === undefined) {
            result.value = { payment: null, totalInterest: null, schedule: [] }
        }
        return { payment: null, totalInterest: null, schedule: [] }
        }

        const monthlyRate = (intRate / 100) / 12
        const payment = loanAmt * monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths))

        let balance = loanAmt
        let totalInterestAcc = 0
        let currentDate = new Date(startDt)
        const schedule = []

        for (let i = 1; i <= termMonths; i++) {
        const interest = balance * monthlyRate
        const principal = payment - interest
        balance -= principal
        totalInterestAcc += interest

        const options = { year: 'numeric', month: 'short' } as const
        const paymentDate = currentDate.toLocaleDateString('en-US', options)

        schedule.push({
            month: i,
            date: paymentDate,
            payment,
            principal,
            interest,
            totalInterest: totalInterestAcc,
            balance: balance > 0 ? balance : 0,
        })

        currentDate.setMonth(currentDate.getMonth() + 1)
        }

        if (amount === undefined) {
        result.value = {
            payment,
            totalInterest: totalInterestAcc,
            schedule,
        }
        }

        return { payment, totalInterest: totalInterestAcc, schedule }
    }

    function addLoan(amount: number, months: number, rate: number, start: string) {
        if (loans.value.length >= 5) return
        const calc = calculate(amount, months, rate, start)
            loans.value.push({
            amount,
            months,
            rate,
            start,
            payment: calc.payment,
            totalInterest: calc.totalInterest,
        })
    }

    function removeLoan(index: number) {
        loans.value.splice(index, 1)
    }

    watch(termInYears, (val) => {
        if (val) termInMonths.value = null
        calculate()
    })

    watch(termInMonths, (val) => {
        if (val) termInYears.value = null
        calculate()
    })

    watch([loanAmount, interestRate, startDate], () => {
        calculate()
    })

    return {
        loanAmount,
        termInYears,
        termInMonths,
        interestRate,
        startDate,
        result,
        loans,
        calculate,
        addLoan,
        removeLoan
    }
})
