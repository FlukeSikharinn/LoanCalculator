<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { useArticle } from '../composables/useArticle'
    import { useClientToken } from '../composables/useClientToken'
    import Swal from 'sweetalert2'

    const { initToken } = useClientToken()
    const { articles, loadingArticles, errorArticles, getArticles, totalArticles, deleteArticle } = useArticle()

    const page = ref(1)
    const limit = 3

    function loadPage(p: number) {
        page.value = p
        getArticles(page.value, limit)
    }

    const showModal = ref(false)

    const editingArticle = ref(null)

    function editBlog(blog) {
        editingArticle.value = blog
        showModal.value = true
    }

    async function deleteBlog(id) {
        const result = await Swal.fire({
            title: 'Confirm Delete',
            text: 'Are you sure you want to delete this article?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        })

        if (result.isConfirmed) {
             Swal.fire({
                title: 'Deleting...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
            const success = await deleteArticle(id)
            if (success) {
                loadPage(page.value)
                Swal.fire('Deleted!', 'Your article has been deleted.', 'success')
            }
        }
    }

    function reloadBlogs() {
        loadPage(page.value)
    }

    onMounted(() => {
        loadPage(1)
        initToken()
    })
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <div class="flex-grow container mx-auto flex mt-8">
            <div class="w-full bg-white p-6 rounded shadow">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-xl font-bold">Articles</h4>
                    <button
                        @click="showModal = true"
                        class="border-2 cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1 rounded-lg transition duration-100"
                        >
                        Create article
                    </button>
                </div>

                <div>
                    <div v-if="loadingArticles" class="space-y-4">
                        <div v-for="n in limit" :key="n" class="border rounded shadow p-4 mb-4 animate-pulse h-24 bg-gray-200"></div>
                    </div>

                    <div v-else>
                        <BlogCard 
                        v-for="blog in articles" 
                        :key="blog.id" 
                        :blog="blog" 
                        @edit="editBlog" 
                        @delete="deleteBlog" 
                        />
                    </div>
                </div>
                <div class="mt-4 flex gap-2">
                    <button v-for="p in Math.ceil(totalArticles / limit)" :key="p"
                    @click="loadPage(p)"
                    class="px-3 py-1 border rounded cursor-pointer"
                    :class="{ 'bg-blue-500 text-white': p === page }"
                    >
                    {{ p }}
                    </button>
                </div>
            </div>
        </div>
        <CreateArticleModal v-model="showModal" :article="editingArticle" @saved="reloadBlogs" />
    </div>
</template>
