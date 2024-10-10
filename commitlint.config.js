module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'header-max-length': [2, 'always', 72],
      'type-enum': [
        2,
        'always',
        [
          'feat', // Features
          'fix',  // Bug fixes
          'docs', // Documentation changes
          'style', // Changes that do not affect the meaning of the code (white-space, formatting, etc.)
          'refactor', // Code changes that neither fix a bug nor add a feature
          'perf', // Performance improvements
          'test', // Adding missing tests or correcting existing tests
          'chore', // Other changes that don’t modify src or test files
        ],
      ],
    },
  };
  