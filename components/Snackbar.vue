<template>
  <v-snackbar
    :value="value"
    :timeout="3000"
    top
  >
    {{ text }}
    <v-btn
      dark
      text
      @click="$emit('input', false)"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
