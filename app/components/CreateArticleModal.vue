<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useCategoryTag } from '../composables/useCategoryTag'
import { useArticle } from '../composables/useArticle'
import Swal from 'sweetalert2'

const props = defineProps<{
  article?: any | null
}>()
const emit = defineEmits(['saved'])

const show = defineModel<boolean>({ default: false })

const articleTitle = ref('')
const articleContent = ref('')
const selectedCategory = ref<number | null>(null)
const selectedTags = ref<number[]>([])

const { createArticle, updateArticle } = useArticle()
const { categories, tags, fetchCategories, fetchTags, loading, error } = useCategoryTag()

function toggleTag(id: number) {
  const idx = selectedTags.value.indexOf(id)
  if (idx === -1) selectedTags.value.push(id)
  else selectedTags.value.splice(idx, 1)
}

watch(
  () => props.article,
  (newVal) => {
    if (newVal) {
      articleTitle.value = newVal.title
      articleContent.value = newVal.content
      selectedCategory.value = newVal.category ?? null
      selectedTags.value = newVal.tags?.map(t => t) ?? []
    } else {
      resetForm()
    }
  },
  { immediate: true, deep: true }
)

function resetForm() {
  articleTitle.value = ''
  articleContent.value = ''
  selectedCategory.value = null
  selectedTags.value = []
}

async function handleSave() {
  if (!articleTitle.value.trim() || !articleContent.value.trim() || !selectedCategory.value) {
    Swal.fire('Warning', 'Please fill in all required fields: Title, Content, Category.', 'warning')
    return
  }

  const data = {
    title: articleTitle.value,
    content: articleContent.value,
    category_id: selectedCategory.value,
    tags: selectedTags.value
  }

  const action = props.article ? 'update' : 'create'

  const confirmResult = await Swal.fire({
    title: `Are you sure you want to ${action} this article?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: action === 'create' ? 'Create' : 'Update',
    cancelButtonText: 'Cancel'
  })

  if (confirmResult.isConfirmed) {
    try {
      Swal.fire({
        title: action === 'create' ? 'Creating...' : 'Updating...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      let result
      if (props.article) {
        result = await updateArticle(props.article.id, data)
      } else {
        result = await createArticle(data)
      }

      Swal.close()

      if (result) {
        Swal.fire(
          action === 'create' ? 'Created!' : 'Updated!',
          `Your article has been ${action === 'create' ? 'created' : 'updated'}.`,
          'success'
        )
        emit('saved')
        show.value = false
      } else {
        Swal.fire('Error', 'Something went wrong', 'error')
      }
    } catch (err: any) {
      Swal.close()
      Swal.fire('Error', err.message || 'Something went wrong', 'error')
    }
  }
}

onMounted(() => {
  fetchCategories()
  fetchTags()
})
</script>


<template>
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <transition
        enter-active-class="transition transform ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition transform ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="show"
          class="bg-white rounded-lg w-full max-w-2xl shadow-lg"
        >
          <div class="flex justify-between items-center border-b p-4">
            <h3 class="text-lg font-semibold">Create New Article</h3>
            <button @click="show = false" class="text-gray-500 hover:text-gray-800">&times;</button>
          </div>
            
          <div class="p-4 space-y-4">
            <input
              v-model="articleTitle"
              type="text"
              placeholder="Article Title"
              class="w-full border rounded px-3 py-2"
            />
            <RichTextEditor v-model="articleContent" />

            <div>
              <label for="category-select" class="font-semibold block mb-1">Category</label>
              <select
                id="category-select"
                v-model="selectedCategory"
                class="w-full border rounded px-3 py-2"
              >
                <option :value="null" disabled>Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="font-semibold block mb-1">Tags</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in tags"
                  :key="tag.id"
                  type="button"
                  @click="toggleTag(tag.id)"
                  :class="[
                    'px-3 py-1 rounded cursor-pointer border',
                    selectedTags.includes(tag.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
                  ]"
                >
                  {{ tag.name }}
                </button>
              </div>
            </div>

            <div v-if="loading" class="text-gray-500">Loading...</div>
            <div v-if="error" class="text-red-500">{{ error }}</div>
          </div>

          <div class="flex justify-end space-x-2 border-t p-4">
            <button
              @click="show = false"
              class="cursor-pointer transition duration-100 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              @click="handleSave"
              class="cursor-pointer transition duration-100 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
            >
              Save
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
