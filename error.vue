<template>
  <NuxtLayout>
    <v-app>
      <v-main>
        <v-container fluid style="height: 100%">
          <h1>{{ title }}</h1>
          <p v-if="error?.message">{{ error.message }}</p>
          <v-btn class="mt-4" color="primary" @click="handleError">Go home</v-btn>
        </v-container>
      </v-main>
    </v-app>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const title = computed(() =>
  props.error?.statusCode === 404 ? 'Page not found' : 'Something went wrong',
)

function handleError() {
  clearError({ redirect: '/' })
}
</script>
