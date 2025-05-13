module.exports = {
  extends: ['@commitlint/config-conventional'],
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  },
  rules: {
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'type-enum': [2, 'always', [
      'feat',    // New feature (Minor version)
      'fix',     // Bug fix (Patch version)
      'perf',    // Performance improvements
      'docs',    // Documentation changes
      'style',   // Code style changes
      'refactor',// Code refactoring
      'test',    // Adding or modifying tests
      'chore',   // Maintenance tasks
      'ci'       // CI configuration changes
    ]],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']]
  },
  plugins: [
    {
      rules: {
        'type-allowed-on-branch': (parsed, when, value) => {
          const branchName = process.env.GITHUB_REF?.replace('refs/heads/', '') || 
                           process.env.CI_COMMIT_REF_NAME || 
                           require('child_process').execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
          
          // Define allowed types for each branch
          const branchRules = {
            'main': ['feat', 'fix', 'perf']
          };
          
          const allowedTypes = branchRules[branchName];
          if (!allowedTypes) return [true];
          
          return [
            allowedTypes.includes(parsed.type),
            `Commit type "${parsed.type}" is not allowed on branch "${branchName}". Allowed types: ${allowedTypes.join(', ')}`
          ];
        }
      }
    }
  ]
};
