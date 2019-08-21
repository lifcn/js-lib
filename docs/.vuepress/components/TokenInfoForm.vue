<script>
export default {
  name: 'TokenInfoForm',
  data: function() {
    return {
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
        const eoneo = new EoneoPay(process.env.EONEO_API_KEY)
        const response = await eoneo.getTokenInfo(this.form.token)

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
