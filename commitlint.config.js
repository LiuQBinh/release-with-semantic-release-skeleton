module.exports = {
  // parserPreset: {
  //   parserOpts: {
  //     headerPattern: /^(([\w-]*(.*))|([\w-]*)(?:\((.*)\))?!?:(.*))$/,
  //   },
  // },
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
          const validTypes = types
            .filter(type => typeof type === 'string' || (Array.isArray(type) && type[1] !== false))
            .map(type => typeof type === 'string' ? type : type[0]);

            console.log(parsed);
            
          const isValidType = types.some(type => {
            if (typeof type === 'string') {
              return parsed.raw.startsWith(type);
            }
            if (Array.isArray(type)) {
              if (type[1] === false) return false;
              return parsed.raw.startsWith(type[0]);
            }
            return type.test && type.test(parsed.raw);
          });

          return [
            isValidType,
            `Commit type must be one of: ${validTypes.join(', ')} or match pattern SEC-1234`
          ];
        },
      },
    },
  ],
}
