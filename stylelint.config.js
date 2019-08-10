module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-css-modules',
  ],
  plugins: [
    'stylelint-scss',
  ],
  rules: {
    'indentation': [
      2,
      {
        baseIndentLevel: 0,
      }
    ],
    'no-descending-specificity': null,
    'string-no-newline': null,
    'selector-id-pattern': /^[a-zA-Z\\-]*$/,
    'selector-max-universal': 1,
    'selector-max-type': [
      0,
      {
        ignore: ['child', 'descendant', 'compounded'],
      },
    ],
    'selector-pseudo-element-colon-notation': 'single',
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['else'],
      },
    ],
    'scss/dollar-variable-colon-space-after': 'always',
    'scss/dollar-variable-colon-space-before': 'never',
    'scss/dollar-variable-no-missing-interpolation': true,
    'scss/dollar-variable-pattern': /^[a-z-]+$/,
    'scss/double-slash-comment-whitespace-inside': 'always',
    'scss/operator-no-newline-before': true,
    'scss/operator-no-unspaced': true,
    'scss/selector-no-redundant-nesting-selector': true,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': null,
    'no-duplicate-at-import-rules': null,
  },
}
