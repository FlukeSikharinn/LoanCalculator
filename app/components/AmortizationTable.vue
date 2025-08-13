<script setup lang="ts">
    import { useLoanCalculatorStore } from '../stores/loanCalculator'
    import { useFormat } from '../composables/useFormat'
    const store = useLoanCalculatorStore()
    const { formatCurrency } = useFormat()

    async function exportPDF() {
        if (typeof window === 'undefined') return

        const { useLoanCalculatorStore } = await import('../stores/loanCalculator')
        const { useFormat } = await import('../composables/useFormat')

        const store = useLoanCalculatorStore()
        const { formatCurrency } = useFormat()

        const { jsPDF } = await import('jspdf')
        const autoTable = (await import('jspdf-autotable')).default

        const doc = new jsPDF()
        doc.setFontSize(16)
        doc.text('Amortization Schedule', 14, 15)

        const tableData = store.result.schedule.map(row => [
            row.month,
            row.date,
            formatCurrency(row.payment, 'pdf'),
            formatCurrency(row.principal, 'pdf'),
            formatCurrency(row.interest, 'pdf'),
            formatCurrency(row.balance, 'pdf'),
        ])

        autoTable(doc, {
            head: [['#', 'Date', 'Payment', 'Principal', 'Interest', 'Balance']],
            body: tableData,
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66] },
            styles: { fontSize: 10 },
        })

        const pdfBlob = doc.output('bloburl')
        window.open(pdfBlob)
    }
</script>

<template>
    <div class="bg-white rounded-xs mt-5 shadow-lg overflow-hidden p-6 border border-gray-300">
        <div class="text-center">
            <div class="flex justify-between items-center mb-4">
                <h4 class="text-xl font-bold">Amortization Schedule</h4>
                <button
                    @click="exportPDF"
                    class="border-2 cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition duration-100"
                    >
                    Export PDF
                </button>
            </div>
            <div class="overflow-x-auto" id="amortization-table-id">
                <table class="min-w-full text-sm border border-gray-200 shadow-md rounded-lg overflow-hidden">
                    <thead class="bg-gray-100">
                        <tr>
                        <th class="px-4 py-2 border-b border-gray-200">#</th>
                        <th class="px-4 py-2 border-b border-gray-200">Date</th>
                        <th class="px-4 py-2 border-b border-gray-200 text-right">Payment</th>
                        <th class="px-4 py-2 border-b border-gray-200 text-right">Principal</th>
                        <th class="px-4 py-2 border-b border-gray-200 text-right">Interest</th>
                        <th class="px-4 py-2 border-b border-gray-200 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="row in store.result.schedule"
                        :key="row.month"
                        class="border-b border-gray-200 hover:bg-gray-50"
                        >
                        <td class="px-4 py-2 text-center">{{ row.month }}</td>
                        <td class="px-4 py-2">{{ row.date ?? '-' }}</td>
                        <td class="px-4 py-2 text-right">{{ formatCurrency(row.payment) }}</td>
                        <td class="px-4 py-2 text-right">{{ formatCurrency(row.principal) }}</td>
                        <td class="px-4 py-2 text-right">{{ formatCurrency(row.interest) }}</td>
                        <td class="px-4 py-2 text-right">{{ formatCurrency(row.balance) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
