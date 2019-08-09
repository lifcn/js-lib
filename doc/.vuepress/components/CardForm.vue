<script>
  export default {
    data: function() {
      return {
        form: {
          expiry: "05 / 21",
          name: "User Name",
          number: "5123450000000008",
        },
        token: null,
        error: null,
      }
    },
    computed: {
      eoneo() {
        return EoneoPay('MN6FWJJ3P77WHAE6')
      },
      isNumberValid() {
        return this.eoneo.validateCardNumber(this.form.number)
      },
      isExpiryValid() {
        return true
      },
      isNameValid() {
        return true
      },
    },
    methods: {
      submit() {
        if (
          this.isNumberValid &&
          this.isExpiryValid &&
          this.isNameValid
        ) {
          const params = {
            ...this.form,
            expiry: {
              month: this.form.expiry.split('/')[0],
              year: this.form.expiry.split('/')[1],
            },
          }

          this.error = null
          this.token = null

          this.eoneo.tokeniseCard(params)
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
    <input :class="{ 'form-number--not-valid': !isNumberValid }" placeholder="Card Number" type="text" v-model="form.number"/>
    <input :class="{ 'form-expiry--not-valid': !isExpiryValid }" placeholder="MM / YY" type="text" v-model="form.expiry"/>
    <input :class="{ 'form-name--not-valid': !isNameValid }" placeholder="Cardholder Name" type="text" v-model="form.name"/>
    <button type="submit" @click="submit">Tokenise</button>
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
