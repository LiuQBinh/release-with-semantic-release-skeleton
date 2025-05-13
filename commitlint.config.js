module.exports = {
  extends: ['@commitlint/config-conventional'],
  helpUrl: `\n\n      URL:\n      https://github.com/conventional-changelog/commitlint/#what-is-commitlint\n\n      Example: \n      git commit -m "docs: update README with new setup instructions"`,
  rules: {
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'type-enum': [2, 'always', [
      'docs',    // Documentation changes
      'style',   // Code style changes
      'refactor',// Code refactoring
      'test',    // Adding or modifying tests
      'chore',   // Maintenance tasks
      'ci'       // CI configuration changes
    ]],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'body-max-line-length': [2, 'always', 300]
    
  }
};
