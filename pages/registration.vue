<template>
  <div class="register-page">
    <form class="register-form" @submit.prevent="handleAuth">
      <img class="logo" src="../assets/LOGOTRANSSMALL.png" alt="">
      <h2 class="register-form__title">Create Account</h2>

      <Textfield v-model="email" autocomplete="email" class="register-form__field" label="Email" type="email" required />

      <Textfield v-model="username" autocomplete="username" class="register-form__field" label="Username" required />

      <Textfield v-model="password" autocomplete="new-password" class="register-form__field" label="Password" type="password" required />

      <Button type="submit" variant="primary" class="register-form__submit">
        Sign Up
      </Button>

      Already have an account?
      <NuxtLink to="/login">Login</NuxtLink>
    </form>
  </div>
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
    const user = await NetworkService.post('/registration', formData);
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

<style scoped lang="scss">
.register-page {
  background: var(--bg);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.register-form {
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
