<script setup lang="ts">
  import { computed } from 'vue'
  import { useClientToken } from '../composables/useClientToken'
  interface Blog {
      id: number
      title: string
      owner_token: string
      content: string
      liked: boolean
      bookmarked: boolean
  }

  const props = defineProps<{ blog: Blog }>()
  const emit = defineEmits(['edit', 'delete'])

  const { initToken } = useClientToken()
  const myToken = initToken()

  const isOwner = computed(() => props.blog.owner_token === myToken)

  const excerpt = (text: string) => {
      const words = text.split(' ')
      return words.length > 10 ? words.slice(0, 10).join(' ') + '...' : text
  }
</script>

<template>
  <div class="border rounded shadow p-4 mb-4 flex gap-4">
    <!-- <img :src="" alt="blog image" class="w-24 h-24 object-cover rounded" /> -->
    <div class="flex flex-col flex-grow">
      <h4 class="font-semibold text-lg mb-1">{{ blog.title }}</h4>
      <div class="text-gray-600 mb-2" v-html="excerpt(blog.content)"></div>
      <div class="flex justify-between text-sm text-gray-500">
        <span></span>
        <div class="flex gap-4">
          <span class="cursor-pointer select-none" :class="{'text-red-500': blog.liked}">❤️ Like</span>
          <span class="cursor-pointer select-none" :class="{'text-blue-500': blog.bookmarked}">🔖 Bookmark</span>
          <template v-if="isOwner">
            <button @click="$emit('edit', blog)" class="cursor-pointer border-2 p-1 rounded-md">✏️ Edit</button>
            <button @click="$emit('delete', blog.id)" class="cursor-pointer border-2 p-1 rounded-md">🗑 Delete</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  
</style>
