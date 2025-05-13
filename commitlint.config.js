module.exports = {
  extends: ['@commitlint/config-conventional'],
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/, //Exampe: git commit -m "docs: add README"
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  },
  rules: {
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'type-enum': [2, 'always', [
      // 'feat',    // New feature (Minor version)
      // 'fix',     // Bug fix (Patch version)
      // 'perf',    // Performance improvements
      'docs',    // Documentation changes
      'style',   // Code style changes
      'refactor',// Code refactoring
      'test',    // Adding or modifying tests
      'chore',   // Maintenance tasks
      'ci'       // CI configuration changes
    ]],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']]
  }
};
