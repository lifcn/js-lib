<script>
export default {
  name: 'TokenizeCardForm',
  data: function() {
    return {
      eoneo: new EoneoPay('MN6FWJJ3P77WHAE6'),
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
  },
  methods: {
    async onSubmit() {
      const { form } = this

      this.processing = true
      this.response = ''
      this.error = ''

      try {
        const response = await this.eoneo.tokenizeCard({
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
        label="Card Number"
      />
      <base-input
        v-model="form.month"
        :class="$style.inputMonth"
        :disabled="disabled"
        :unmasked="true"
        :mask="/^(\d){0,2}$/"
        label="Month"
      />
      <base-input
        v-model="form.year"
        :class="$style.inputYear"
        :disabled="disabled"
        :mask="/^(\d){0,4}$/"
        label="Year"
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
  align-items: flex-end;
}

.inputName {
  flex-grow: 1;
  margin-right: 1rem;
  margin-left: 1rem;
}

.inputMonth,
.inputYear {
  width: 80px;
  margin-left: 1rem;
}

@media (max-width: 719px) {
  .form {
    flex-wrap: wrap;
  }

  .inputNumber {
    width: 50%;
  }

  .inputMonth,
  .inputYear {
    flex-grow: 1;
    width: 80px;
  }

  .inputName {
    margin-top: 0 !important;
    margin-left: 0;
  }
}
</style>
