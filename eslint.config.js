import globals from 'globals';
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [{
  files: ['src/**/*.js', 'tests/**/*.js', '*.config.js'],
  languageOptions: {
    globals: {
      ...globals.node
    }
  },
  plugins: {
    '@stylistic/js': stylisticJs
  },
  rules: {
    ...js.configs.recommended.rules,
    // Stylistic
    '@stylistic/js/array-bracket-newline': ['error', 'consistent'],
    '@stylistic/js/array-bracket-spacing': ['error', 'never'],
    '@stylistic/js/array-element-newline': ['error', 'consistent'],
    '@stylistic/js/arrow-parens': ['error', 'always'],
    '@stylistic/js/arrow-spacing': ['error', { before: true, after: true }],
    '@stylistic/js/block-spacing': ['error', 'always'],
    '@stylistic/js/brace-style': ['error', '1tbs'],
    '@stylistic/js/comma-dangle': ['error', 'never'],
    '@stylistic/js/comma-spacing': ['error', { before: false, after: true }],
    '@stylistic/js/comma-style': ['error', 'last'],
    '@stylistic/js/computed-property-spacing': ['error', 'never'],
    '@stylistic/js/dot-location': ['error', 'property'],
    '@stylistic/js/eol-last': ['error', 'always'],
    '@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
    '@stylistic/js/function-call-spacing': ['error', 'never'],
    '@stylistic/js/function-paren-newline': ['error', 'multiline'],
    '@stylistic/js/generator-star-spacing': ['error', { before: true, after: false }],
    '@stylistic/js/implicit-arrow-linebreak': ['error', 'beside'],
    '@stylistic/js/indent': ['error', 2],
    '@stylistic/js/jsx-quotes': ['error', 'prefer-double'],
    '@stylistic/js/key-spacing': ['error', { beforeColon: false }],
    '@stylistic/js/keyword-spacing': ['error', { before: true }],
    '@stylistic/js/linebreak-style': ['error', 'unix'],
    '@stylistic/js/lines-around-comment': ['error', { beforeBlockComment: true }],
    '@stylistic/js/lines-between-class-members': ['error', 'always'],
    '@stylistic/js/max-len': ['error', { code: 120 }],
    '@stylistic/js/max-statements-per-line': ['error', { max: 1 }],
    '@stylistic/js/multiline-ternary': ['error', 'always-multiline'],
    '@stylistic/js/new-parens': ['error', 'always'],
    '@stylistic/js/newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
    '@stylistic/js/no-confusing-arrow': ['error', { allowParens: true }],
    // '@stylistic/js/no-extra-parens': ['error', 'all'],
    '@stylistic/js/no-extra-semi': ['error'],
    '@stylistic/js/no-floating-decimal': ['error'],
    '@stylistic/js/no-mixed-operators': ['error'],
    '@stylistic/js/no-mixed-spaces-and-tabs': ['error'],
    '@stylistic/js/no-multi-spaces': ['error'],
    '@stylistic/js/no-multiple-empty-lines': ['error'],
    '@stylistic/js/no-tabs': ['error'],
    '@stylistic/js/no-trailing-spaces': ['error'],
    '@stylistic/js/no-whitespace-before-property': ['error'],
    '@stylistic/js/nonblock-statement-body-position': ['error', 'beside'],
    '@stylistic/js/object-curly-newline': ['error'],
    '@stylistic/js/object-curly-spacing': ['error', 'always'],
    // '@stylistic/js/object-property-newline': ['error'],
    '@stylistic/js/one-var-declaration-per-line': ['error', 'initializations'],
    '@stylistic/js/operator-linebreak': ['error', 'before'],
    '@stylistic/js/padded-blocks': ['error', 'never'],
    '@stylistic/js/padding-line-between-statements': ['error'],
    '@stylistic/js/quote-props': ['error', 'as-needed'],
    '@stylistic/js/quotes': ['error', 'single'],
    '@stylistic/js/rest-spread-spacing': ['error', 'never'],
    '@stylistic/js/semi': ['error', 'always'],
    '@stylistic/js/semi-spacing': ['error', { before: false, after: true }],
    '@stylistic/js/semi-style': ['error', 'last'],
    '@stylistic/js/space-before-blocks': ['error', 'always'],
    '@stylistic/js/space-before-function-paren': ['error', 'always'],
    '@stylistic/js/space-in-parens': ['error', 'never'],
    '@stylistic/js/space-infix-ops': ['error'],
    '@stylistic/js/space-unary-ops': ['error'],
    '@stylistic/js/spaced-comment': ['error', 'always'],
    '@stylistic/js/switch-colon-spacing': ['error', { after: true, before: false }],
    '@stylistic/js/template-curly-spacing': ['error', 'never'],
    '@stylistic/js/template-tag-spacing': ['error', 'never'],
    '@stylistic/js/wrap-iife': ['error', 'outside'],
    // '@stylistic/js/wrap-regex': ['error'],
    '@stylistic/js/yield-star-spacing': ['error', { before: false, after: true }]
  }
}];
