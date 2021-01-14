module.exports = {
  extends: [
    'stylelint-config-standard'
  ],
  rules: {
    'number-leading-zero': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'each',
          'else',
          'function',
          'if',
          'include',
          'mixin',
          'return',
        ],
      }
    ],
  },
}
