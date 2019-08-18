<script>
export default {
  name: 'BaseAlert',
  props: {
    type: {
      type: String,
      default: 'success',
    },
    json: {
      type: [Object, String],
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
  },
  computed: {
    computedType() {
      if (this.error) return 'error'

      return this.type
    },
    formattedJson() {
      return this.json && JSON.stringify(this.json, null, 2).trim()
    },
  },
}
</script>

<template>
  <div
    :class="[
      'base-alert',
      `base-alert--${computedType}`,
    ]"
  >
    <div
      v-if="json"
      class="base-alert__json"
      v-html="formattedJson"
    />
    <div
      v-if="error"
      class="base-alert__error"
    >
      {{ error }}
    </div>
    <slot />
  </div>
</template>

<style lang="scss">
.base-alert {
  padding: 12px;
  border-radius: 4px;

  &--success {
    background: #c8e6c9;
    border: 1px solid #4caf50;
  }

  &--error {
    background: #ffcdd2;
    border: 1px solid #f44336;
  }

  &__json {
    font-family: monospace;
    font-size: 14px;
    white-space: pre-wrap;
  }
}
</style>
