import Storage from '~/services/Storage';
import type { DB } from '~/types';

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return;

  const user = Storage.get<DB>(STORAGE_USER_KEY);
  
  // if (user && to.name !== ROUTE.CHAT) {
  //   return navigateTo("/" + ROUTE.CHAT);
  // }

  if (!user && ![ROUTE.LOGIN, ROUTE.REGISTRATION].includes(to.name as string)) {
    return navigateTo('/login');
  }
});