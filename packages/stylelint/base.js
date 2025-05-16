/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  overrides: [
    {
      files: ['**/*.jsx', '**/*.tsx'],
      customSyntax: 'postcss-styled-syntax',
      rules: {
        /* This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as Sass or Less, as they have their own syntaxes. */
        'media-query-no-invalid': null,
      },
    },
  ],
  rules: {
    'selector-class-pattern': [
      // camelCase or kebab-case, or start with Mui (override Material-UI classes)
      '^((Mui[A-Za-z0-9-]+)|[a-z]+([A-Z][a-z]+)*(-[a-z]+([A-Z][a-z]+)*)*)$',
      {
        severity: 'error',
      },
    ],
    'keyframes-name-pattern': [
      // camelCase or kebab-case
      '^[a-z]+([A-Z][a-z]+)*(-[a-z]+([A-Z][a-z]+)*)*$',
      {
        severity: 'error',
      },
    ],
    'media-feature-range-notation': [
      /* Use "@media (min-width: 30em)" instead of "@media (30em <= width)" (New syntax). Because it does not support older browsers  */
      'prefix',
    ],
    'color-function-notation': 'legacy',
    'declaration-block-no-redundant-longhand-properties': null,
    'at-rule-empty-line-before': null,
    'rule-empty-line-before': null,
    'comment-empty-line-before': null,
    'declaration-empty-line-before': null,
  },
}
