<script>
export default {
  name: 'TokenizeCardForm',
  data: function() {
    return {
      form: {
        month: '01',
        year: "21",
        name: "User Name",
        number: "5123450000000008",
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
    date: {
      get() {
        return `${this.form.month}/${this.form.year}`
      },
      set(value) {
        const parsed = value.split('/')
        this.form.month = parsed[0] || ''
        this.form.year = parsed[1] || ''
      },
    },
  },
  methods: {
    async onSubmit() {
      const { form } = this

      this.processing = true
      this.response = ''
      this.error = ''

      try {
        const eoneo = new EoneoPay({
          token: Cookie.getCookie('eoneo_api_token') || process.env.EONEO_API_KEY,
          url: process.env.EONEO_API_URL
        })
        const response = await eoneo.tokenizeCard({
          name: form.name,
          number: form.number,
          expiry: {
            month: form.month,
            year: form.year,
          },
        })

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
        :unmask="true"
        :lazy="true"
        mask="0000 0000 0000 0000"
        placeholder="0000 0000 0000 0000"
        label="Card Number"
      />
      <base-input
        v-model="form.name"
        :class="$style.inputName"
        :disabled="disabled"
        :lazy="true"
        :mask="/^([a-zA-Z.\'\-]*[a-zA-Z.]+\s)*([a-zA-Z.\'\-]+)?$/"
        label="Card Holder"
      />
      <base-input
        v-model="date"
        :class="$style.inputDate"
        :disabled="disabled"
        :lazy="true"
        mask="00 / 00"
        placeholder="MM / YY"
        label="Month"
      />
      <base-button
        type="submit"
        :disabled="disabled"
        :class="$style.submit"
        @click="onSubmit"
      >
        Tokenise
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

.inputName {
  flex-grow: 1;
  margin-right: 1rem;
  margin-left: 1rem;
}

.inputDate {
  width: 81px;
  margin-right: 1rem;
}

.inputNumber {
  flex-grow: 1;
}

@media (max-width: 719px) {
  .form {
    flex-wrap: wrap;
  }

  .inputDate {
    flex-grow: 1;
    width: 81px;
  }

  .inputName {
    margin-top: 0 !important;
    margin-left: 0;
  }
}
</style>
