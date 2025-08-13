<script setup lang="ts">
    import { defineProps, defineEmits } from 'vue'

    const props = defineProps({
    show: Boolean,
    })

    const emit = defineEmits(['update:show'])

    function close() {
    emit('update:show', false)
    }
</script>

<template>
    <div
        v-if="show"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="close"
    >
        <div class="bg-white rounded shadow-lg max-w-3xl w-full p-6 relative">
        <button
            class="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            @click="close"
            aria-label="Close modal"
        >
            ✖️
        </button>
        <slot />
        </div>
    </div>
</template>
