<template>
  <span
    :class="{
      message: true,
      system: props.type === MESSAGE_TYPE.SYSTEM,
      other: props.self && props.type !== MESSAGE_TYPE.SYSTEM,
    }"
  >
    {{ props.content }}
    <span v-if="props.type !== MESSAGE_TYPE.SYSTEM" class="message__time">{{
      formatTimeIntl(props.createdAt)
    }}</span>
  </span>
</template>

<script setup lang="ts">
import { MESSAGE_TYPE } from "~/services/SocketService";

const props = defineProps<{
  id: string;
  type: MESSAGE_TYPE;
  self: boolean;
  content: string;
  createdAt: number;
}>();
</script>

<style lang="scss" scoped>
.message {
  background-color: #a0c4ff;
  padding: 5px 10px;
  border-radius: 10px;
  color: black;
  margin-bottom: 10px;
  margin-right: auto;

  &.received {
    margin-left: auto;
    margin-right: 0;
  }

  &__time {
    margin-left: 10px;
    font-size: 12px;
  }
}

.system {
  background-color: grey;
  color: white;
  margin: 0 auto;
}

.other {
  margin-left: auto;
  margin-right: 0;
  background: #cccccc;
}
</style>

<style src="../assets//main.scss"></style>
