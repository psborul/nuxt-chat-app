<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { toasts } = useToast()
</script>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

/* Each toast */
.toast {
  pointer-events: auto;
  position: relative;
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--text-on-primary);
  min-width: 280px;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

/* Toast types */
.toast.success {
  background-color: var(--color-success);
  border-color: color-mix(in srgb, var(--color-success) 80%, black);
}
.toast.error {
  background-color: var(--color-error);
  border-color: color-mix(in srgb, var(--color-error) 80%, black);
}
.toast.info {
  background-color: var(--color-info);
  border-color: color-mix(in srgb, var(--color-info) 80%, black);
}

/* Enter animation */
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.toast-enter-active {
  transition: all 0.3s ease;
}

/* Exit animation */
.toast-leave-active {
  position: absolute;
  transition: all 0.4s ease;
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
