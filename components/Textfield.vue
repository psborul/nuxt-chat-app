<template>
  <div class="textfield" :class="{ 'has-error': errorMessage }">
    <label v-if="label">{{ label }}</label>
    <!-- TODO: ADD SEMANTIC LABEL FOR AND ETC -->
    <input v-bind="$attrs" v-model="model" :type="type" :placeholder="placeholder" class="textfield__input">
    <p v-if="errorMessage" class="textfield__error">{{ errorMessage }}</p>
  </div>
</template>


<script setup lang="ts">
const model = defineModel<string>();

defineProps<{
  label?: string;
  placeholder?: string;
  type?: string;
  errorMessage?: string;
}>();
</script>

<style scoped lang="scss">
.textfield {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 14px;
    color: var(--muted);
  }

  &__input {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background-color: var(--surface);
    color: var(--text);
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s, background-color 0.2s;

    &::placeholder {
      color: var(--muted);
    }

    &:focus {
      border-color: var(--color-primary);
    }
  }

  &__error {
    font-size: 13px;
    color: var(--color-error);
  }

  &.has-error {
    .textfield__input {
      border-color: var(--color-error);
    }

    label {
      color: var(--color-error);
    }
  }
}
</style>
