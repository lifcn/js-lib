<script>
import get from 'lodash/get'

export default {
  name: 'BaseButton',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
}
</script>

<template>
  <button
    v-bind="$attrs"
    class="base-button"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<style lang="scss">
.base-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  margin-top: var(--size-margin);
  margin-bottom: var(--size-margin);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  color: var(--color-primary-text);
  text-decoration: none;
  text-transform: none;
  cursor: pointer;
  background: var(--color-primary);
  border: none;
  border-radius: 4px;
  outline: none;
  transition:
    color 120ms ease-in-out,
    background-color 120ms ease-in-out,
    border-color 120ms ease-in-out,
    box-shadow 120ms ease-in-out,
    opacity 120ms ease-in-out;

  &:hover {
    background: var(--color-primary-dark);
  }

  &:disabled {
    cursor: default;
    background: var(--color-disabled) !important;
  }
}
</style>
