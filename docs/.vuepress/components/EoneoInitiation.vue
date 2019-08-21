<script>
export default {
  name: 'EoneoInitiation',
  props: {
    additional: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    token() {
      return process.env.EONEO_API_KEY
    },
    url() {
      return process.env.EONEO_API_URL
    },
  },
}
</script>

<template>
  <div
    v-if="additional"
    class="language-javascript extra-class"
  >
    <pre class="language-javascript"><code><span class="token keyword">const</span> eoneo <span class="token operator">=</span><span class="token keyword"> new</span> <span class="token class-name">EoneoPay</span><span class="token punctuation">(<span class="token punctuation">{</span></span>
    token<span class="token punctuation">: </span><span class="token string">'{{ token }}'</span><span class="token punctuation">,</span>
    url<span class="token punctuation">: </span><span class="token string">'{{ url }}'</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span></code></pre>
  </div>
  <div
    v-else
    class="language-javascript extra-class"
  >
    <pre class="language-javascript"><code><span class="token keyword">const</span> eoneo <span class="token operator">=</span><span class="token keyword"> new</span> <span class="token class-name">EoneoPay</span><span class="token punctuation">(</span><span class="token string">'{{ token }}'</span><span class="token punctuation">)</span></code></pre>
  </div>
</template>

