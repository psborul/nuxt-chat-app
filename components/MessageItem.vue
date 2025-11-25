<template>
  <div :class="{
    'message-container': true,
    'message-container--self': props.self,
    'message-container--other': !props.self && props.type !== MESSAGE_TYPE.SYSTEM,
    'message-container--system': props.type === MESSAGE_TYPE.SYSTEM,
  }">
    <!-- Message bubble with username, content, and time together -->
    <div :class="{
      message: true,
      'message--system': props.type === MESSAGE_TYPE.SYSTEM,
      'message--self': props.self,
      'message--other': !props.self && props.type !== MESSAGE_TYPE.SYSTEM,
    }">
      <!-- For system messages, just show content -->
      <template v-if="props.type === MESSAGE_TYPE.SYSTEM">
        {{ props.content }}
      </template>
      
      <!-- For regular messages: username at top, content in middle, time at bottom right -->
      <template v-else>
        <!-- Username at the top -->
        <div class="message__username">{{ props.username || 'Unknown User' }}</div>
        
        <!-- Message content -->
        <div class="message__content">{{ props.content }}</div>
        
        <!-- Time at bottom right -->
        <div class="message__time">{{ formatTimeIntl(props.createdAt) }}</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MESSAGE_TYPE } from '~/services/SocketService';
import { formatTimeIntl } from '~/utils/helpers';

const props = defineProps<{
  id: string;
  type: MESSAGE_TYPE;
  self: boolean;
  content: string;
  createdAt: number | string;
  username?: string;
}>();
</script>

<style scoped lang="scss">
.message-container {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
  max-width: 75%;
  
  &--self {
    align-items: flex-end;
    margin-left: auto;
    margin-right: 0;
  }
  
  &--other {
    align-items: flex-start;
    margin-left: 0;
    margin-right: auto;
  }
  
  &--system {
    align-items: center;
    margin: var(--spacing-sm) auto;
    max-width: 90%;
  }
}

.message {
  padding: var(--spacing-md);
  border-radius: 18px;
  word-break: break-word;
  font-size: 15px;
  line-height: 1.4;
  box-shadow: var(--shadow);
  position: relative;
  min-width: 120px;
  
  &--self {
    background-color: var(--color-primary);
    color: var(--text-on-primary);
    border-bottom-right-radius: 6px;
  }
  
  &--other {
    background-color: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
    border-bottom-left-radius: 6px;
  }
  
  &--system {
    background-color: var(--surface-muted);
    color: var(--text-muted);
    text-align: center;
    font-style: italic;
    font-size: var(--text-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    max-width: 300px;
  }
  
  &__username {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    
    .message--self & {
      color: rgba(255, 255, 255, 0.9);
    }
    
    .message--other & {
      color: var(--color-primary);
    }
  }
  
  &__content {
    margin-bottom: var(--spacing-sm);
    line-height: 1.5;
  }
  
  &__time {
    font-size: 11px;
    font-weight: 400;
    text-align: right;
    margin-top: var(--spacing-xs);
    
    .message--self & {
      color: rgba(255, 255, 255, 0.7);
    }
    
    .message--other & {
      color: var(--text-light);
    }
  }
}

/* Dark theme adjustments */
[theme="dark"] {
  .message {
    &--other {
      background-color: var(--surface);
      border-color: var(--border);
    }
    
    &--system {
      background-color: var(--surface-variant);
    }
  }
}

@media (max-width: 768px) {
  .message-container {
    max-width: 85%;
  }
  
  .message {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>