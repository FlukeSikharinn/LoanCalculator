<script setup lang="ts">
    import { computed, watch, ref } from 'vue'
    import { useLoanCalculatorStore } from '../stores/loanCalculator'
    import { Pie, Line, Bar } from 'vue-chartjs'
    const store = useLoanCalculatorStore()

    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        CategoryScale,
        LinearScale,
        BarElement,
        PointElement,
        LineElement,
    } from 'chart.js'

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        ArcElement,
        CategoryScale,
        LinearScale,
        BarElement,
        PointElement,
        LineElement
    )

    const pieData = computed(() => {
        if (!store) return null
        const principal = store.loanAmount
        const interest = store.result.totalInterest || 0
        return {
            labels: ['Principal', 'Interest'],
            datasets: [
            {
                label: 'Amount',
                backgroundColor: ['#fc9272', '#9272fc'],
                data: [principal, interest],
            },
            ],
        }
    })

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
            position: 'bottom',
            },
            tooltip: {
            enabled: true,
            },
        },
    }

    const lineData = computed(() => {
        if (!store) return null
        const schedule = store.result.schedule || []

        return {
            labels: schedule.map((item: any) => item.date),
            datasets: [
            {
                label: 'Balance Remaining',
                data: schedule.map((item: any) => item.balance),
                fill: false,
                borderColor: '#53bde9',
                backgroundColor: '#53bde9',
                tension: 0.3,
                pointRadius: 3,
                pointHoverRadius: 6,
            },
            ],
        }
    })

    const lineOptions = {
        responsive: true,
        plugins: {
            tooltip: { enabled: true },
            legend: { position: 'top' },
        },
        scales: {
            y: {
            beginAtZero: true,
            ticks: { callback: (val: number) => `$${val.toLocaleString()}` },
            },
        },
    }

    const barData = computed(() => {
        if (!store) return null
        const schedule = store.result.schedule || []

        const yearlyInterest: Record<string, number> = {}

        schedule.forEach((item: any) => {
            const year = new Date(item.date).getFullYear()
            yearlyInterest[year] = (yearlyInterest[year] || 0) + item.interest
        })

        const years = Object.keys(yearlyInterest).sort()
        const interestValues = years.map((year) => yearlyInterest[year])

        return {
            labels: years,
            datasets: [
            {
                label: 'Interest Paid Per Year',
                backgroundColor: '#fbabd1',
                data: interestValues,
            },
            ],
        }
    })

    const barOptions = {
        responsive: true,
        plugins: {
            tooltip: { enabled: true },
            legend: { position: 'top' },
        },
        scales: {
            y: {
            beginAtZero: true,
            ticks: { callback: (val: number) => `$${val.toLocaleString()}` },
            },
        },
    }

    const containerStyle = ref({
        maxWidth: '400px',
        margin: '0 auto',
    })
</script>

<template>
    <div :style="containerStyle">
        <h2 class="text-center mb-4 font-semibold text-lg">Loan Data Visualization</h2>

        <section class="mb-10">
            <h3 class="mb-2 font-medium text-gray-700">Principal vs Interest (Pie Chart)</h3>
            <Pie v-if="pieData" :data="pieData" :options="pieOptions" />
            <p v-else class="text-center text-gray-400">No loan data available</p>
        </section>

        <section class="mb-10">
            <h3 class="mb-2 font-medium text-gray-700">Balance Remaining Over Time (Line Chart)</h3>
            <Line v-if="lineData" :data="lineData" :options="lineOptions" />
            <p v-else class="text-center text-gray-400">No loan data available</p>
        </section>

        <section>
            <h3 class="mb-2 font-medium text-gray-700">Interest Paid Per Year (Bar Chart)</h3>
            <Bar v-if="barData" :data="barData" :options="barOptions" />
            <p v-else class="text-center text-gray-400">No loan data available</p>
        </section>
    </div>
</template>

<style scoped>
    @media (max-width: 640px) {
    div[style] {
        max-width: 100% !important;
    }
    }
</style>
