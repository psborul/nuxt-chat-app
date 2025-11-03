<template>
  <div class="login-page">
    <form class="login-form" @submit.prevent="handleAuth">
      <h2 class="login-form__title">Sign in</h2>

      <Textfield v-model="email" autocomplete="email" class="login-form__field" label="Email" type="email" required />

      <Textfield v-model="password" autocomplete="current-password" class="login-form__field" label="Password" type="password" required />

      <Button type="submit" variant="primary" class="login-form__submit">
        Sign in
      </Button>

      New to Chat? Create an account
      <NuxtLink to="/registration">Register</NuxtLink>
    </form>
  </div>
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

<style scoped lang="scss">
.login-page {
  background: var(--bg);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.login-form {
  background-color: var(--surface);
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__title {
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    color: var(--text);
  }

  &__field {
    color: var(--text);
  }

  &__submit {
    background-color: var(--color-primary);
    color: #fff;
    border: none;
    font-weight: 600;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background-color: color-mix(in srgb, var(--color-primary) 90%, black);
    }
  }
}

.logo {
  width: 200px;
  margin: 0 auto;
}
</style>
