<template>
  <button v-bind="$attrs" :class="props.variant">
    <slot />
  </button>
</template>

<script setup lang="ts">
type Props = {
  variant?: "primary" | "secondary" | "danger";
};

const props = defineProps<Props>()

</script>

<style scoped lang="scss">
button {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  color: var(--text-on-primary);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.primary {
  background-color: var(--color-primary);

  &:hover {
    background-color: color-mix(in srgb, var(--color-primary) 90%, black);
  }
}

.secondary {
  background-color: var(--color-secondary);

  &:hover {
    background-color: color-mix(in srgb, var(--color-secondary) 90%, black);
  }
}

.danger {
  background-color: var(--color-error);

  &:hover {
    background-color: color-mix(in srgb, var(--color-error) 90%, black);
  }
}
</style>
