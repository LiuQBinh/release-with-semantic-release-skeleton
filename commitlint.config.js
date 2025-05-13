module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^(([\w-]*(.*))|([\w-]*)(?:\((.*)\))?!?:(.*))$/,
    },
  },
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
      /^OAM-\d+/i,
      /^release\/OAM-\d+/i,
    ]],
  },
  plugins: [
    {
      rules: {
        'function-rules/type-enum': (a, _, types) => {
          // in case `hotfix` no need to check OAM-\d pattern
          return [
            types.some(x => {
              if (typeof x == 'string') {
                return a.raw.startsWith(x) && /(^OAM-\d+\s*|\sOAM-\d+\s|OAM-\d+$)/i.test(a.raw)
              } else {
                if (typeof x[0] == 'string') {
                  return a.raw.startsWith(x[0])
                } else {
                  return x.test && x.test(a.raw)
                }
              }
            }),
            `type must be one of pattern OAM-1234 OR ${types.map(e => typeof e == 'string' ? e : e[0]).join(', ')}`,
          ]
        },
      },
    },
  ],
}
