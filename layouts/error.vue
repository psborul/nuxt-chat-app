<template>
  <v-app>
    <v-content>
      <v-container fluid style="height: 100%">
        <h1 v-if="error.statusCode === 404">Page not found</h1>
        <h1 v-else>An error occurred</h1>
        <nuxt-link to="/">Home page</nuxt-link>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: ["error"]
  // layout: 'blog' // you can set a custom layout for the error page
};
</script>
