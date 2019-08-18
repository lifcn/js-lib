<script>
export default {
  name: 'TokenInfoForm',
  data: function() {
    return {
      eoneo: new EoneoPay('MN6FWJJ3P77WHAE6'),
      form: {
        token: '7J8DCM8EAFFMEWGDXZM2',
      },
      response: '',
      error: '',
      processing: false,
    }
  },
  computed: {
    disabled() {
      return this.processing
    },
  },
  methods: {
    async onSubmit() {
      const { token } = this.form

      this.processing = true
      this.response = ''
      this.error = ''

      try {
        const response = await this.eoneo.getTokenInfo(this.form.token)

        this.response = response
      } catch (error) {
        this.error = error.message
      } finally {
        this.processing = false
      }
    },
  },
}
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.form">
      <base-input
        v-model="form.token"
        :class="$style.tokenInput"
        :disabled="disabled"
        label="Token"
        type="text"
      />
      <base-button
        type="submit"
        :disabled="disabled"
        @click="onSubmit"
      >
        Tokenize
      </base-button>
    </div>

    <base-alert
      v-if="response || error"
      :json="response"
      :error="error"
    />
  </div>
</template>

<style lang="scss" module>
.form {
  display: flex;
  align-items: flex-end;
}

.tokenInput {
  flex-grow: 1;
  margin-right: 1rem;
}
</style>
