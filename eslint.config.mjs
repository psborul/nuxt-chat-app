// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Component names in this project ("Message", "ChatForm") are unambiguous
    // in context; we don't enforce Vue's multi-word convention.
    'vue/multi-word-component-names': 'off',
  },
})
