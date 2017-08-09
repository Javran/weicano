module.exports = {
  'plugins': [
    'import'
  ],
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
    'mocha': true,
  },
  "parserOptions": {
    "ecmaFeatures": {
    }
  },
  'parser': 'babel-eslint',
  'rules': {
    'semi': ['error', 'never'],
    'no-restricted-syntax': ["error", {
      'selector': 'ExportDefaultDeclaration',
      'message': 'Always use named exports'
    }],
    'no-lonely-if': 'off',
    'no-floating-decimal': 'off',
    'indent': ['error',2 , {'flatTernaryExpressions': true}],
    'no-underscore-dangle': ['error', { 'allowAfterThis': true }],
    'import/extensions': ['error', { 'es': 'never' }],
    'import/no-extraneous-dependencies': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-confusing-arrow': ['error', {'allowParens': true}],
    'import/prefer-default-export': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-underscore-dangle': ['error', { 'allow': ['__','__r','__n'] }],
    'no-console': ['error', { 'allow': ['warn', 'error', 'info'] }],
    'no-continue': 'off',
    'space-in-parens': 'off',
    'object-curly-spacing': 'off',
    'space-unary-ops': 'off',
    'object-property-newline': 'off',
    'space-infix-ops': 'off',
    'curly': 'off',
    'quotes': 'off',
    'comma-spacing': 'off',
    'array-callback-return': 'off',
    'no-nested-ternary': 'off',
    'no-confusing-arrow': 'off',
    'no-unused-vars':
      [ 'error',
        {
          'vars': 'all',
          'varsIgnorePattern': '^_[a-zA-Z].*',
          'args': 'all',
          'argsIgnorePattern': '^_[a-zA-Z].*'
        }
      ],
    'no-else-return': 'off',
    'no-mixed-operators': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off'
  },
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx'],
        'paths': [__dirname],
      },
    },
    'import/core-modules': [
    ],
  },
}
