module.exports = {
  // parserPreset: {
  //   parserOpts: {
  //     headerPattern: /^(([\w-]*(.*))|([\w-]*)(?:\((.*)\))?!?:(.*))$/,
  //   },
  // },
  defaultIgnores: false,
  rules: {
    'type-enum': [0],
    'type-case': [0],
    'function-rules/type-enum': [2, 'always', [
      'build',
      'chore',
      'ci',
      'docs',
      ['hotfix', false],
      'refactor',
      'revert',
      'style',
      'test',
      /^SEC-\d+/i,
      /^release\/SEC-\d+/i,
    ]],
  },
  plugins: [
    {
      rules: {
        'function-rules/type-enum': (parsed, _, types) => {
          // Skip validation for GitHub Actions bot commits and release commits
          const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
          const isReleaseCommit = parsed.raw.includes('[skip ci]') || parsed.raw.startsWith('chore(release):');
          if (isGitHubActions && isReleaseCommit) {
            return [true, ''];
          }

          const validTypes = types
            .filter(type => typeof type === 'string' || (Array.isArray(type) && type[1] !== false))
            .map(type => typeof type === 'string' ? type : type[0]);

          const isValidType = types.some(type => {
            if (typeof type === 'string') {
              return parsed.raw.match(new RegExp(`^${type}(?:\\([^)]+\\))?:`));
            }
            if (Array.isArray(type)) {
              if (type[1] === false) return false;
              return parsed.raw.match(new RegExp(`^${type[0]}(?:\\([^)]+\\))?:`));
            }
            return type.test && type.test(parsed.raw);
          });

          const hasTaskName = parsed.raw.match(/SEC-\d{3,}/);
          const finalResult = isValidType && hasTaskName;

          if (!finalResult) {
            console.log('\n❌ Commit message validation failed');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Your message:', parsed.raw);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            if (!isValidType) {
              console.log('\n❌ Invalid commit type');
              console.log('Must start with one of:', validTypes.join(', '));
              console.log('\nExamples for your case:');
              console.log('  docs: SEC-123 API interface has');
              console.log('  docs(surface): SEC-123 API interface has');
            }
            if (!hasTaskName) {
              console.log('\n❌ Missing task name');
              console.log('Must include SEC-123 format');
              console.log('\nExamples for your case:');
              console.log('  docs: SEC-123 API interface has');
              console.log('  docs(surface): SEC-123 API interface has');
            }
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          }

          console.log('Final validation result:', Boolean(finalResult));
          return [
            finalResult,
            ''  // Empty message to avoid duplicate error
          ];
        },
      },
    },
  ],
}
