<template>
  <button :class="props.type">
    <slot />
  </button>
</template>

<script setup lang="ts">
type Props = {
  type?: "primary" | "secondary" | "danger";
};

const props = defineProps<Props>()

</script>

<style scoped lang="scss">
.primary {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
}

.secondary {
  background-color: #28a076;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
}

.danger {
  background-color: #9b4242;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
}
</style>
