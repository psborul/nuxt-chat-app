<template>
  <AuthForm title="Create Account" submit-text="Sign Up" @submit="handleAuth">
    <Textfield v-model="email" autocomplete="email" label="Email" type="email" required />
    <Textfield v-model="username" autocomplete="username" label="Username" required />
    <Textfield v-model="password" autocomplete="new-password" label="Password" type="password" required />
    
    <template #footer>
      Already have an account?
      <NuxtLink to="/login">Login</NuxtLink>
    </template>
  </AuthForm>
</template>

<script setup lang="ts">

import NetworkService from '~/services/api/NetworkService';
import Storage from '~/services/Storage';

const router = useRouter();

const email = ref('');
const username = ref('');
const password = ref('');

const { addToast, clearToasts } = useToast();

const handleAuth = async () => {
  const formData = {
    email: email.value,
    username: username.value,
    password: password.value
  };

  try {
    const user = await NetworkService.post("v1/auth/register", formData);
    clearToasts();
    Storage.set(STORAGE_USER_KEY, user);
    router.push({ name: ROUTE.ROOMS });
  } catch (err: any) {
    addToast(err.message, 'error');
    console.error('Registration failed:', err.message);
  }
};

definePageMeta({
  middleware: 'auth'
});
</script>

