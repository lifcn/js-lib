<script>
export default {
  data() {
    return {
      form: {
        prefix: "111066",
        name: "0xc6626f3ab01acf1e",
        number: "254280294",
      },
      processing: false,
      response: '',
      error: '',
    }
  },
  computed: {
    disabled() {
      return this.processing
    },
  },
  methods: {
    async onSubmit() {
      const { form } = this

      this.processing = true
      this.response = ''
      this.error = ''

      try {
        const eoneo = new EoneoPay({ token: process.env.EONEO_API_KEY, url: process.env.EONEO_API_URL })
        const response = await eoneo.tokenizeAccount(form)

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
        v-model="form.number"
        :class="$style.inputNumber"
        :disabled="disabled"
        label="Card Number"
      />
      <base-input
        v-model="form.prefix"
        :class="$style.inputPrefix"
        :disabled="disabled"
        :unmasked="true"
        :mask="/^(\d){0,10}$/"
        label="Prefix"
      />
      <base-input
        v-model="form.name"
        :class="$style.inputName"
        :disabled="disabled"
        label="Card Holder"
      />
      <base-button
        type="submit"
        :disabled="disabled"
        :class="$style.submit"
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
  flex-wrap: nowrap;
  align-items: flex-end;
}

.inputName {
  flex-grow: 1;
  margin-right: 1rem;
  margin-left: 1rem;
}

.inputPrefix {
  width: 100px;
  margin-left: 1rem;
}

@media (max-width: 719px) {
  .form {
    flex-wrap: wrap;
  }

  .inputNumber {
    width: 50%;
  }

  .inputPrefix {
    flex-grow: 1;
  }

  .inputName {
    margin-top: 0 !important;
    margin-left: 0;
  }
}
</style>
