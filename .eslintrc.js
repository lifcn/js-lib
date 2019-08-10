module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  extends: [
    'plugin:vue/recommended',
  ],
  rules: {
    'no-debugger': process.env.PRE_COMMIT ? 'error' : 'off',
    'no-console': process.env.PRE_COMMIT
      ? [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ]
      : 'off',
    'no-useless-escape': 0,
    'vue/multiline-html-element-content-newline': 'error',
    'vue/singleline-html-element-content-newline': 'error',
    'vue/no-spaces-around-equal-signs-in-attribute': 'error',
    'vue/component-name-in-template-casing': ['warn', 'kebab-case'],
    'vue/no-v-html': 'off',
    'vue/script-indent': ['error', 2, {
      'baseIndent': 0,
    }]
  },
}
