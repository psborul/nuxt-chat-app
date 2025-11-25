<template>
  <div class="auth-page">
    <form class="auth-form" @submit.prevent="$emit('submit')">
      <h2 class="auth-form__title">{{ title }}</h2>
      
      <slot />
      
      <Button type="submit" variant="primary" class="auth-form__submit">
        {{ submitText }}
      </Button>
      
      <div class="auth-form__footer">
        <slot name="footer" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  submitText: string;
}>();

defineEmits<{
  submit: [];
}>();
</script>

<style scoped lang="scss">
.auth-page {
  background: var(--bg);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.auth-form {
  background-color: var(--surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 360px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);

  &__title {
    margin-bottom: var(--spacing-sm);
    font-size: var(--text-xl);
    font-weight: 600;
    text-align: center;
    color: var(--text);
  }

  &__submit {
    margin-top: var(--spacing-sm);
  }

  &__footer {
    text-align: center;
    color: var(--text-muted);
    font-size: var(--text-sm);
    
    a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
