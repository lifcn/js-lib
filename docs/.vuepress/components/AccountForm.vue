<script>
export default {
  data() {
    return {
      form: {
        prefix: "111066",
        name: "0xc6626f3ab01acf1e0240dd08dcf64b8b2d706ff8e9ef5e",
        number: "254280294",
      },
      token: null,
      error: null,
    }
  },
  computed: {
    eoneo() {
      return new EoneoPay('MN6FWJJ3P77WHAE6')
    },
    isNumberValid() {
      return this.eoneo.validateAccountNumber(this.form.number)
    },
    isPrefixValid() {
      return true
    },
    isNameValid() {
      return this.eoneo.validateAccountName(this.form.name)
    },
  },
  methods: {
    submit() {
      if (
        this.isNumberValid &&
        this.isPrefixValid &&
        this.isNameValid
      ) {
        this.error = null
        this.token = null

        this.eoneo.tokeniseAccount(this.form)
          .then(response => {
            this.token = response.token
          })
          .catch(exception => {
            this.error = exception.message
          })
      }
    },
  },
}
</script>

<template>
  <div>
    <input
      v-model="form.number"
      :class="{ 'form-number--not-valid': !isNumberValid }"
      placeholder="Card Number"
      type="text"
    >
    <input
      v-model="form.prefix"
      :class="{ 'form-expiry--not-valid': !isPrefixValid }"
      placeholder="Prefix"
      type="text"
    >
    <input
      v-model="form.name"
      :class="{ 'form-name--not-valid': !isNameValid }"
      placeholder="Cardholder Name"
      type="text"
    >
    <button
      type="submit"
      @click="submit"
    >
      Tokenise
    </button>
    <div :class="[error && 'form-error', token && 'form-token']">
      {{ error || token }}
    </div>
  </div>
</template>

<style>
.form-number--not-valid {
  border-color: red;
}

.form-expiry--not-valid {
  border-color: red;
}

.form-name--not-valid {
  border-color: red;
}

.form-token {
  background-color: #3eaf7c;
}

.form-error {
  background-color: #da5961;
}
</style>
