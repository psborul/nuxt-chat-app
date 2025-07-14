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
  margin-bottom: 8px; /* space between toasts */
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  color: white;
  min-width: 220px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Toast types */
.toast.success {
  background-color: var(--color-success);
}
.toast.error {
  background-color: var(--color-error);
}
.toast.info {
  background-color: var(--color-primary);
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
