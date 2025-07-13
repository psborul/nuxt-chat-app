<template>
  <div class="register-page">
    <form class="register-form" @submit.prevent="handleAuth">
      <h2 class="register-form__title">Create Account</h2>

      <Textfield
        v-model="email"
        class="register-form__field"
        label="Email"
        type="email"
        required
      />

      <Textfield
        v-model="username"
        class="register-form__field"
        label="Username"
        required
      />

      <Textfield
        v-model="password"
        class="register-form__field"
        label="Password"
        type="password"
        required
      />

      <Button type="submit" class="register-form__submit">
        Sign Up
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import NetworkService from '~/services/NetworkService';
import Storage from '~/services/Storage';

const router = useRouter();

const email = ref('');
const username = ref('');
const password = ref('');

const handleAuth = async () => {
  const formData = {
    email: email.value,
    username: username.value,
    password: password.value
  };

  try {
    const user = await NetworkService.post('/api/registration', formData);
    Storage.set(STORAGE_USER_KEY, user);
    router.push({ name: ROUTE.ROOMS });
  } catch (err: any) {
    console.error('Registration failed:', err.message);
  }
};

definePageMeta({
  middleware: 'auth'
});
</script>

<style scoped lang="scss">
.register-page {
  background: #121212;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.register-form {
  background-color: #1e1e1e;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__title {
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
  }

  &__field {
    color: #ffffff;
  }

  &__submit {
    background-color: #1976d2;
    color: white;
    border: none;
    font-weight: 600;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background-color: #1565c0;
    }
  }
}
</style>
