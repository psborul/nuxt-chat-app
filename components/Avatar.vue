<template>
  <div 
    class="avatar" 
    :class="[`avatar--${size}`, { 'avatar--online': showStatus && online }]"
    :style="{ backgroundColor: avatarColor }"
  >
    <span class="avatar__text">{{ initials }}</span>
    <div v-if="showStatus" class="avatar__status" :class="{ 'avatar__status--online': online }" />
  </div>
</template>

<script setup lang="ts">
import { getInitials, generateAvatarColor } from '~/utils/color';

interface Props {
  username: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  showStatus?: boolean;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  online: false,
  showStatus: false,
  color: 'var(--color-primary)'
});

const initials = computed(() => getInitials(props.username));

const avatarColor = computed(() => 
  props.color || generateAvatarColor(props.username)
);
</script>

<style scoped lang="scss">
.avatar {
  position: relative;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--text-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  
  &--sm {
    width: var(--avatar-sm);
    height: var(--avatar-sm);
    font-size: var(--text-xs);
  }
  
  &--md {
    width: var(--avatar-md);
    height: var(--avatar-md);
    font-size: var(--text-sm);
  }
  
  &--lg {
    width: var(--avatar-lg);
    height: var(--avatar-lg);
    font-size: var(--text-base);
  }
  
  &__text {
    line-height: 1;
  }
  
  &__status {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid var(--surface);
    background-color: var(--text-muted);
    
    &--online {
      background-color: var(--color-success);
    }
  }
}
</style>
