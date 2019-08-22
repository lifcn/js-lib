<script>
export default {
  name: 'Helpers',
  props: {
    getPaymentSystem: {
      type: Boolean,
      default: false,
    }
  },
  data: function() {
    return {
      number: "5123450000000008",
    }
  },
  computed: {
    eoneo() {
      return new EoneoPay(({ token: process.env.EONEO_API_KEY, url: process.env.EONEO_API_URL }))
    },
    typeOfCard() {
      return this.eoneo.getPaymentSystem(this.number)
    }
  },
}
</script>

<template>
  <div v-if="getPaymentSystem">
    <div :class="$style.row">
      <base-input
        v-model="number"
        :class="$style.inputCard"
        :unmask="true"
        :lazy="true"
        mask="0000 0000 0000 0000"
        placeholder="0000 0000 0000 0000"
        label="Card Number"
      />
      <div :class="$style.infoCard">
        <img
          v-if="typeOfCard === 'mastercard'"
          :class="$style.mastercard"
          src="/mastercard.svg"
        >
        <img
          v-if="typeOfCard === 'visa' || typeOfCard === 'visaelectron'"
          :class="$style.visa"
          src="/visa.svg"
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.row {
  display: flex;
  align-items: flex-end;
}

.inputCard {
  width: 50%;
  min-width: 250px;
}

.infoCard {
  margin-left: 15px;
}

.mastercard {
  height: 35px;
  margin-bottom: 15px;
}

.visa {
  height: 24px;
  margin-bottom: 20px;
}
</style>