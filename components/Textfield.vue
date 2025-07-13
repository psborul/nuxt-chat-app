<template>
  <div class="textfield">
    <label v-if="label">{{ label }}</label>
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      class="textfield__input"
    >
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>()

defineProps<{
  label?: string
  placeholder?: string
  type?: string
}>()
</script>

<style scoped lang="scss">
.textfield {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 14px;
    color: #ccc;
  }

  &__input {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #666;
    background-color: #1e1e1e;
    color: white;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #42a5f5;
    }
  }
}
</style>
