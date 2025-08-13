import { ref } from 'vue'
import { supabase } from '@/utils/supabaseClient'
const { initToken } = useClientToken()

interface ArticleInput {
  title: string
  content: string
  category_id: number
  tags: number[]
}
interface ArticleRow {
  id: number
  title: string
  content: string
  owner_token: string
  article_categories: { category: { id: number } }[]
  article_tags: { tag: { id: number } }[]
}

export function useArticle() {
  const loadingCreate = ref(false)
  const errorCreate = ref<string | null>(null)

  const articles = ref<any[]>([])
  const loadingArticles = ref(false)
  const errorArticles = ref<string | null>(null)
  const totalArticles = ref(0)
  const loadingUpdate = ref(false)
  const errorUpdate = ref<string | null>(null)
  const loadingDelete = ref(false)
  const errorDelete = ref<string | null>(null)

  async function createArticle(article: ArticleInput) {
    loadingCreate.value = true
    errorCreate.value = null

    try {
      const ownerToken = initToken()
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .insert([{
          title: article.title,
          owner_token: ownerToken,
          content: article.content
        }])
        .select()

      if (articleError) throw articleError
      if (!articleData || !articleData.length) throw new Error('Article not created')

      const articleId = articleData[0].id

      const { error: categoryError } = await supabase
        .from('article_categories')
        .insert([{
          article_id: articleId,
          category_id: article.category_id
        }])
      if (categoryError) throw categoryError

      if (article.tags && article.tags.length > 0) {
        const tagRows = article.tags.map(tagId => ({
          article_id: articleId,
          tag_id: tagId
        }))
        const { error: tagError } = await supabase
          .from('article_tags')
          .insert(tagRows)
        if (tagError) throw tagError
      }

      loadingCreate.value = false
      return articleData[0]

    } catch (err: any) {
      console.error(err)
      errorCreate.value = err.message || 'Error creating article'
      loadingCreate.value = false
      return null
    }
  }

  async function getArticles(page = 1, limit = 2) {
    loadingArticles.value = true
    errorArticles.value = null

    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          content,
          owner_token,
          article_categories (
            category: categories ( id )
          ),
          article_tags (
            tag: tags ( id )
          )
        `, { count: 'exact' })
        .eq('is_archived', false)
        .range(from, to) as unknown as { data: ArticleRow[], error: any, count: number }

      if (error) throw error
      articles.value = data.map(a => ({
        id: a.id,
        title: a.title,
        content: a.content,
        owner_token: a.owner_token,
        category: a.article_categories?.[0]?.category?.id || '',
        tags: a.article_tags?.map(t => t.tag?.id).filter(Boolean) || []
      }))

      totalArticles.value = count || 0
      loadingArticles.value = false
    } catch (err: any) {
      errorArticles.value = err.message || 'Error fetching articles'
      loadingArticles.value = false
    }
  }

  async function updateArticle(id: number, article: ArticleInput) {
    loadingUpdate.value = true
    errorUpdate.value = null

    try {
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          title: article.title,
          content: article.content
        })
        .eq('id', id)

      if (updateError) throw updateError

      await supabase.from('article_categories').delete().eq('article_id', id)

      if (article.category_id) {
        await supabase.from('article_categories').insert([{
          article_id: id,
          category_id: article.category_id
        }])
      }

      await supabase.from('article_tags').delete().eq('article_id', id)

      if (Array.isArray(article.tags) && article.tags.length > 0) {
        const tagsInsert = article.tags.map((tagId: number) => ({
          article_id: id,
          tag_id: tagId
        }))
        await supabase.from('article_tags').insert(tagsInsert)
      }

      loadingUpdate.value = false
      return true
    } catch (err: any) {
      errorUpdate.value = err.message || 'Error updating article'
      loadingUpdate.value = false
      return false
    }
  }

  async function deleteArticle(id: number) {
    loadingDelete.value = true
    errorDelete.value = null
    try {
      const { error } = await supabase
        .from('articles')
        .update({ is_archived: true })
        .eq('id', id)

      if (error) throw error

      loadingDelete.value = false
      return true
    } catch (err: any) {
      errorDelete.value = err.message || 'Error deleting article'
      loadingDelete.value = false
      return false
    }
  }

  return {
    // create
    loadingCreate,
    errorCreate,
    createArticle,

    // get
    articles,
    loadingArticles,
    errorArticles,
    totalArticles,
    getArticles,

    // update
    updateArticle,
    loadingUpdate,
    errorUpdate,

    deleteArticle,
    loadingDelete,
    errorDelete
  }
}