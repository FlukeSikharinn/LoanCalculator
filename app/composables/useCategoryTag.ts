import { ref } from 'vue'
import { supabase } from '@/utils/supabaseClient'

export function useCategoryTag() {
    const categories = ref<any[]>([])
    const tags = ref<any[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchCategories() {
        loading.value = true
        const { data, error: err } = await supabase.from('categories').select('*')
        if (err) {
        error.value = err.message
        } else {
        categories.value = data || []
        }
        loading.value = false
    }

    async function fetchTags() {
        loading.value = true
        const { data, error: err } = await supabase.from('tags').select('*')
        if (err) {
        error.value = err.message
        } else {
        tags.value = data || []
        }
        loading.value = false
    }

    return {
        categories,
        tags,
        loading,
        error,
        fetchCategories,
        fetchTags,
    }
}
