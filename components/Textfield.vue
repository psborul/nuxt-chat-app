<template>
  <div class="textfield" :class="{ 'has-error': errorMessage }">
    <label v-if="label">{{ label }}</label>
    <input
      ref="inputEl"
      v-bind="$attrs"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      class="textfield__input"
    >
    <p v-if="errorMessage" class="textfield__error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>()
const inputEl = ref<HTMLInputElement | null>(null)

defineExpose({
  focus: () => inputEl.value?.focus(),
  inputEl,
})

defineProps<{
  label?: string
  placeholder?: string
  type?: string
  errorMessage?: string
}>()
</script>

<style scoped lang="scss">
.textfield {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text);
    margin-bottom: var(--spacing-xs);
  }

  &__input {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    border: 2px solid var(--border);
    background-color: var(--surface);
    color: var(--text);
    font-size: var(--text-base);
    outline: none;
    transition: all 0.2s ease;
    min-height: 44px; // Better touch target
    font-family: inherit;

    &::placeholder {
      color: var(--text-light);
    }

    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
      background-color: var(--surface);
    }

    &:hover:not(:focus) {
      border-color: var(--text-muted);
    }
  }

  &__error {
    font-size: var(--text-sm);
    color: var(--color-error);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    
    &::before {
      content: "⚠";
      font-size: var(--text-xs);
    }
  }

  &.has-error {
    .textfield__input {
      border-color: var(--color-error);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 20%, transparent);
    }

    label {
      color: var(--color-error);
    }
  }
}
</style>
