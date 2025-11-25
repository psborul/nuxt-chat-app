<template>
  <AuthForm title="Sign in" submit-text="Sign in" @submit="handleAuth">
    <Textfield v-model="email" autocomplete="email" label="Email" type="email" required />
    <Textfield v-model="password" autocomplete="current-password" label="Password" type="password" required />
    
    <template #footer>
      New to Chat? Create an account
      <NuxtLink to="/registration">Register</NuxtLink>
    </template>
  </AuthForm>
</template>

<script setup lang="ts">

import NetworkService from '~/services/api/NetworkService';
import Storage from '~/services/Storage';
import type { User } from '~/utils/types';

const router = useRouter();

const email = ref('');
const password = ref('');

const { addToast, clearToasts } = useToast();

const handleAuth = async () => {
  const formData = {
    email: email.value,
    password: password.value
  };

  try {
    const user = await NetworkService.post<User>('v1/auth/login', formData);
    clearToasts();
    Storage.set(STORAGE_USER_KEY, user);
    router.push({ name: ROUTE.ROOMS });
  } catch (err: any) {
    addToast(err.message, 'error');

    console.error('Login failed:', err.message);
  }
};

definePageMeta({
  middleware: 'auth'
});
</script>

