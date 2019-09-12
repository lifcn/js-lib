<script>
export default {
  name: 'EoneoInitiation',
  data: function() {
    return {
      form: {
        token: Cookie.getCookie('eoneo_api_token') || process.env.EONEO_API_KEY,
      }
    }
  },
  computed: {
    defaultToken() {
      return process.env.EONEO_API_KEY
    },
  },
  methods: {
    onSet() {
      Cookie.setCookie('eoneo_api_token', this.form.token, 1)
    },
    onReset() {
      Cookie.setCookie('eoneo_api_token', this.defaultToken, 1)
      this.form.token = this.defaultToken
    },
  },
}
</script>

<template>
  <div :class="$style.form">
    <base-input
      v-model="form.token"
      :class="$style.input"
      label="Payments API Key"
      type="text"
    />
    <base-button
      type="submit"
      @click="onSet"
    >
      Set
    </base-button>
    <base-button
      :class="$style.reset"
      @click="onReset"
    >
      Reset to default
    </base-button>
  </div>
</template>

<style lang="scss" module>
.form {
  display: flex;
  align-items: flex-end;
}

.input {
  flex-grow: 1;
  margin-right: 1rem;
}

.reset {
  margin-left: 15px;
  background: #bdbdbd !important;
}
</style>