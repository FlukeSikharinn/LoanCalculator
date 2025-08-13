import { ref } from 'vue'

export function useClientToken() {
  const tokenKey = 'client_token'
  const token = ref<string | null>(null)

  function initToken() {
    let existing = localStorage.getItem(tokenKey)
    if (!existing) {
      existing = crypto.randomUUID()
      localStorage.setItem(tokenKey, existing)
    }
    token.value = existing
    return token.value
  }

  return { token, initToken }
}
