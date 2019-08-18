<script>
import get from 'lodash/get'
import { IMaskComponent } from 'vue-imask'

export default {
  name: 'BaseInput',
  components: {
    IMask: IMaskComponent,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      focused: false,
    }
  },
  methods: {
    onFocus() {
      this.focused = true
    },
    onBlur() {
      this.focused = false
    },
  }
}
</script>

<template>
  <div
    :class="[
      'base-input',
      focused && 'base-input--focused',
    ]"
  >
    <div class="base-input__label">
      {{ label }}
    </div>
    <i-mask
      class="base-input__entry"
      v-bind="$attrs"
      v-on="$listeners"
      @blur="onBlur"
      @focus="onFocus"
    />
  </div>
</template>

<style lang="scss">
.base-input {
  display: flex;
  flex-direction: column;
  margin-top: var(--size-margin);
  margin-bottom: var(--size-margin);

  &__label {
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: bold;
  }

  &__entry {
    box-sizing: border-box;
    height: 40px;
    padding: 12px;
    font-size: 14px;
    border: 1px solid #eaecef;
    border-radius: 4px;
    outline: none;
  }

  &--focused {
    .base-input__label {
      color: var(--color-primary);
    }

    .base-input__entry {
      border-color: var(--color-primary);
    }
  }
}
</style>
