import { useChatStore } from '~/stores/chat'

export default defineNuxtRouteMiddleware(() => {
  const store = useChatStore()
  if (!store.isAuthenticated) {
    return navigateTo('/?message=noUser')
  }
})
