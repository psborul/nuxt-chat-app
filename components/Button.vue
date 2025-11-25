<template>
  <button v-bind="$attrs" :class="['btn', `btn--${props.variant}`, props.size !== 'medium' && `btn--${props.size}`]">
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { ButtonVariant, ButtonSize } from '~/types';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium'
});

</script>

<style scoped lang="scss">
.btn {
  /* Chrome-like button base styles */
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-weight: 500;
  font-size: 14px;
  font-family: 'Google Sans', 'Roboto', sans-serif;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  line-height: 1.25;
  text-decoration: none;
  position: relative;
  user-select: none;
  
  &:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.38;
    cursor: default;
    pointer-events: none;
  }

  /* Primary Button - Chrome blue */
  &--primary {
    background-color: var(--color-primary);
    color: var(--text-on-primary);
    box-shadow: var(--shadow);

    &:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
      box-shadow: var(--shadow-button);
    }

    &:active:not(:disabled) {
      background-color: var(--color-primary-active);
      box-shadow: var(--shadow);
    }

    &:focus:not(:disabled) {
      box-shadow: var(--shadow-button), 0 0 0 4px rgba(26, 115, 232, 0.24);
    }
  }

  /* Secondary Button - Chrome outlined with solid background */
  &--secondary {
    background-color: var(--surface);
    color: var(--text);
    border-color: var(--border);
    box-shadow: var(--shadow);

    &:hover:not(:disabled) {
      background-color: var(--surface-hover);
      border-color: var(--border-focus);
      box-shadow: var(--shadow-button);
    }

    &:active:not(:disabled) {
      background-color: var(--surface-variant);
      box-shadow: var(--shadow);
    }

    &:focus:not(:disabled) {
      border-color: var(--border-focus);
      box-shadow: var(--shadow-button), 0 0 0 4px rgba(26, 115, 232, 0.24);
    }
  }

  /* Danger Button - Chrome red */
  &--danger {
    background-color: var(--color-error);
    color: var(--text-on-primary);
    box-shadow: var(--shadow);

    &:hover:not(:disabled) {
      background-color: var(--color-error-hover);
      box-shadow: var(--shadow-button);
    }

    &:active:not(:disabled) {
      background-color: var(--color-error-hover);
      box-shadow: var(--shadow);
    }

    &:focus:not(:disabled) {
      box-shadow: var(--shadow-button), 0 0 0 4px rgba(217, 48, 37, 0.24);
    }
  }

  /* Ghost Button - Chrome text button */
  &--ghost {
    background-color: transparent;
    color: var(--color-primary);
    padding: 8px 12px;
    min-height: 32px;

    &:hover:not(:disabled) {
      background-color: rgba(26, 115, 232, 0.04);
    }

    &:active:not(:disabled) {
      background-color: rgba(26, 115, 232, 0.1);
    }

    &:focus:not(:disabled) {
      background-color: rgba(26, 115, 232, 0.12);
    }
  }

  /* Size variants */
  &--small {
    padding: 6px 12px;
    min-height: 28px;
    font-size: 13px;
  }

  &--large {
    padding: 12px 24px;
    min-height: 48px;
    font-size: 16px;
  }
}

/* Dark theme adjustments */
[theme="dark"] .btn {
  &--secondary {
    background-color: var(--surface);
    color: var(--text);
    
    &:hover:not(:disabled) {
      background-color: var(--surface-hover);
    }

    &:active:not(:disabled) {
      background-color: var(--surface-variant);
    }
  }

  &--ghost {
    color: var(--color-primary);
    
    &:hover:not(:disabled) {
      background-color: rgba(138, 180, 248, 0.08);
    }

    &:active:not(:disabled) {
      background-color: rgba(138, 180, 248, 0.16);
    }

    &:focus:not(:disabled) {
      background-color: rgba(138, 180, 248, 0.12);
    }
  }
}
</style>
