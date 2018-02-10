'use strict'

const off = 'off'
const warn = 'warn'
const error = 'error'

const restrictedProperties = [
  {
    object: 'global',
    property: 'isFinite',
    message: 'Please use Number.isFinite instead',
  },
  {
    object: 'self',
    property: 'isFinite',
    message: 'Please use Number.isFinite instead',
  },
  {
    object: 'window',
    property: 'isFinite',
    message: 'Please use Number.isFinite instead',
  },
  {
    object: 'global',
    property: 'isNaN',
    message: 'Please use Number.isNaN instead',
  },
  {
    object: 'self',
    property: 'isNaN',
    message: 'Please use Number.isNaN instead',
  },
  {
    object: 'window',
    property: 'isNaN',
    message: 'Please use Number.isNaN instead',
  },
  {
    property: '__defineGetter__',
    message: 'Please use Object.defineProperty instead.',
  },
  {
    property: '__defineSetter__',
    message: 'Please use Object.defineProperty instead.',
  },
  {
    object: 'Math',
    property: 'pow',
    message: 'Use the exponentiation operator (**) instead.',
  },
]

const restrictedGlobals = [
  'addEventListener',
  'blur',
  'close',
  'closed',
  'confirm',
  'defaultStatus',
  'defaultstatus',
  'event',
  'external',
  'find',
  'focus',
  'frameElement',
  'frames',
  'history',
  'innerHeight',
  'innerWidth',
  'length',
  'location',
  'locationbar',
  'menubar',
  'moveBy',
  'moveTo',
  'name',
  'onblur',
  'onerror',
  'onfocus',
  'onload',
  'onresize',
  'onunload',
  'open',
  'opener',
  'opera',
  'outerHeight',
  'outerWidth',
  'pageXOffset',
  'pageYOffset',
  'parent',
  'print',
  'removeEventListener',
  'resizeBy',
  'resizeTo',
  'screen',
  'screenLeft',
  'screenTop',
  'screenX',
  'screenY',
  'scroll',
  'scrollbars',
  'scrollBy',
  'scrollTo',
  'scrollX',
  'scrollY',
  'self',
  'status',
  'statusbar',
  'stop',
  'toolbar',
  'top',
]

const config = {
  // Use babel-eslint to parse async/await
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 2017,
  },
  env: {
    es6: true,
    node: true,
  },
  plugins: ['import', 'jsx-a11y', 'react'],
  rules: {
    /**
     * Possible Errors
     *
     * These rules relate to possible syntax or logic errors in JavaScript code.
     */

    // Enforce "for" loop update clause moving the counter in the right direction.
    // https://eslint.org/docs/rules/for-direction
    'for-direction': warn,

    // Enforce return statements in getters.
    // https://eslint.org/docs/rules/getter-return
    'getter-return': warn,

    // Disallow comparing against -0.
    // https://eslint.org/docs/rules/no-compare-neg-zero
    'no-compare-neg-zero': warn,

    // Disallow assignment operators in conditional expressions.
    // https://eslint.org/docs/rules/no-cond-assign
    'no-cond-assign': [warn, 'always'],

    // Disallow constant expressions in conditions.
    // https://eslint.org/docs/rules/no-constant-condition
    'no-constant-condition': warn,

    // Disallow control characters in regular expressions
    // https://eslint.org/docs/rules/no-control-regex
    'no-control-regex': warn,

    // Disallow the use of debugger.
    // https://eslint.org/docs/rules/no-debugger
    'no-debugger': error,

    // Disallow duplicate arguments in function definitions.
    // https://eslint.org/docs/rules/no-dupe-args
    'no-dupe-args': error,

    // Disallow duplicate keys in object literals.
    // https://eslint.org/docs/rules/no-dupe-keys
    'no-dupe-keys': warn,

    // Disallow duplicate case labels.
    // https://eslint.org/docs/rules/no-duplicate-case
    'no-duplicate-case': warn,

    // Disallow empty statements.
    // https://eslint.org/docs/rules/no-empty
    'no-empty': warn,

    // Disallow empty character classes in regular expressions.
    // https://eslint.org/docs/rules/no-empty-character-class
    'no-empty-character-class': warn,

    // Disallow reassigning exceptions in catch clauses.
    // https://eslint.org/docs/rules/no-ex-assign
    'no-ex-assign': warn,

    // Disallow unnecessary boolean casts.
    // https://eslint.org/docs/rules/no-extra-boolean-cast
    'no-extra-boolean-cast': warn,

    // Disallow reassigning function declarations.
    // https://eslint.org/docs/rules/no-func-assign
    'no-func-assign': warn,

    // Disallow variable or function declarations in nested blocks.
    // https://eslint.org/docs/rules/no-inner-declarations
    'no-inner-declarations': warn,

    // Disallow invalid regular expression strings in RegExp constructors.
    // https://eslint.org/docs/rules/no-invalid-regexp
    'no-invalid-regexp': error,

    // Disallow irregular whitespace outside of strings and comments.
    // https://eslint.org/docs/rules/no-irregular-whitespace
    'no-irregular-whitespace': warn,

    // Disallow calling global object properties as functions.
    // https://eslint.org/docs/rules/no-obj-calls
    'no-obj-calls': error,

    // Disallow calling some Object.prototype methods directly on objects.
    // https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': warn,

    // Disallow multiple spaces in regular expressions.
    // https://eslint.org/docs/rules/no-regex-spaces
    'no-regex-spaces': warn,

    // Disallow sparse arrays.
    // https://eslint.org/docs/rules/no-sparse-arrays
    'no-sparse-arrays': warn,

    // Disallow template literal placeholder syntax in regular strings.
    // https://eslint.org/docs/rules/no-template-curly-in-string
    'no-template-curly-in-string': warn,

    // Disallow confusing multiline expressions.
    // https://eslint.org/docs/rules/no-unexpected-multiline
    'no-unexpected-multiline': warn,

    // Disallow unreachable code after return, throw, continue, and break statements.
    // https://eslint.org/docs/rules/no-unreachable
    'no-unreachable': warn,

    // Disallow control flow statements in finally blocks.
    // https://eslint.org/docs/rules/no-unsafe-finally
    'no-unsafe-finally': warn,

    // Disallow negating the left operand of relational operators.
    // https://eslint.org/docs/rules/no-unsafe-negation
    'no-unsafe-negation': warn,

    // Require calls to isNaN() when checking for NaN.
    // https://eslint.org/docs/rules/use-isnan
    'use-isnan': warn,

    // Enforce comparing typeof expressions against valid strings.
    // https://eslint.org/docs/rules/valid-typeof
    'valid-typeof': [
      error,
      {
        requireStringLiterals: true,
      },
    ],

    /**
     * Best Practices
     *
     * These rules relate to better ways of doing things to help you avoid problems.
     */

    // Enforce return statements in callbacks of array methods.
    // https://eslint.org/docs/rules/array-callback-return
    'array-callback-return': warn,

    // Enforce the use of variables within the scope they are defined.
    // https://eslint.org/docs/rules/block-scoped-var
    'block-scoped-var': warn,

    // Require return statements to either always or never specify values.
    // https://eslint.org/docs/rules/consistent-return
    'consistent-return': warn,

    // Enforce consistent brace style for all control statements.
    // https://eslint.org/docs/rules/curly
    curly: warn,

    // Require default cases in switch statements.
    // https://eslint.org/docs/rules/default-case
    'default-case': warn,

    // Enforce dot notation whenever possible.
    // https://eslint.org/docs/rules/dot-notation
    'dot-notation': warn,

    // Require the use of === and !==.
    // https://eslint.org/docs/rules/eqeqeq
    eqeqeq: [warn, 'allow-null'],

    // Require for-in loops to include an if statement.
    // https://eslint.org/docs/rules/guard-for-in
    'guard-for-in': warn,

    // Disallow the use of alert, confirm, and prompt.
    // https://eslint.org/docs/rules/no-alert
    'no-alert': warn,

    // Disallow the use of arguments.caller or arguments.callee.
    // https://eslint.org/docs/rules/no-caller
    'no-caller': error,

    // Disallow lexical declarations in case clauses.
    // https://eslint.org/docs/rules/no-case-declarations
    'no-case-declarations': warn,

    // Disallow division operators explicitly at the beginning of regular expressions.
    // https://eslint.org/docs/rules/no-div-regex
    'no-div-regex': warn,

    // Disallow else blocks after return statements in if statements.
    // https://eslint.org/docs/rules/no-else-return
    'no-else-return': warn,

    // Disallow empty functions.
    // https://eslint.org/docs/rules/no-empty-function
    'no-empty-function': warn,

    // Disallow empty destructuring patterns.
    // https://eslint.org/docs/rules/no-empty-pattern
    'no-empty-pattern': warn,

    // Disallow the use of eval().
    // https://eslint.org/docs/rules/no-eval
    'no-eval': error,

    // Disallow extending native types.
    // https://eslint.org/docs/rules/no-extend-native
    'no-extend-native': warn,

    // Disallow unnecessary calls to .bind().
    // https://eslint.org/docs/rules/no-extra-bind
    'no-extra-bind': warn,

    // Disallow unnecessary labels.
    // https://eslint.org/docs/rules/no-extra-label
    'no-extra-label': warn,

    // Disallow fallthrough of case statements.
    // https://eslint.org/docs/rules/no-fallthrough
    'no-fallthrough': warn,

    // Disallow assignments to native objects or read-only global variables.
    // https://eslint.org/docs/rules/no-global-assign
    'no-global-assign': warn,

    // Disallow shorthand type conversions.
    // https://eslint.org/docs/rules/no-implicit-coercion
    'no-implicit-coercion': warn,

    // Disallow the use of eval()-like methods.
    // https://eslint.org/docs/rules/no-implied-eval
    'no-implied-eval': error,

    // Disallow the use of the __iterator__ property.
    // https://eslint.org/docs/rules/no-iterator
    'no-iterator': warn,

    // Disallow labeled statements.
    // https://eslint.org/docs/rules/no-labels
    'no-labels': warn,

    // Disallow unnecessary nested blocks.
    // https://eslint.org/docs/rules/no-lone-blocks
    'no-lone-blocks': warn,

    // Disallow function declarations and expressions inside loop statements.
    // https://eslint.org/docs/rules/no-loop-func
    'no-loop-func': warn,

    // Disallow multiline strings.
    // https://eslint.org/docs/rules/no-multi-str
    'no-multi-str': warn,

    // Disallow new operators with the Function object.
    // https://eslint.org/docs/rules/no-new-func
    'no-new-func': error,

    // Disallow new operators with the String, Number, and Boolean objects.
    // https://eslint.org/docs/rules/no-new-wrappers
    'no-new-wrappers': warn,

    // Disallow octal literals.
    // https://eslint.org/docs/rules/no-octal
    'no-octal': error,

    // Disallow octal escape sequences in string literals.
    // https://eslint.org/docs/rules/no-octal-escape
    'no-octal-escape': error,

    // Disallow reassigning function parameters.
    // https://eslint.org/docs/rules/no-param-reassign
    'no-param-reassign': warn,

    // Disallow the use of the __proto__ property.
    // https://eslint.org/docs/rules/no-proto
    'no-proto': error,

    // Disallow variable redeclaration.
    // https://eslint.org/docs/rules/no-redeclare
    'no-redeclare': warn,

    // Disallow certain properties on certain objects.
    // https://eslint.org/docs/rules/no-restricted-properties
    'no-restricted-properties': [warn].concat(restrictedProperties),

    // Disallow assignment operators in return statements.
    // https://eslint.org/docs/rules/no-return-assign
    'no-return-assign': [warn, 'except-parens'],

    // Disallow javascript: urls.
    // https://eslint.org/docs/rules/no-script-url
    'no-script-url': warn,

    // Disallow assignments where both sides are exactly the same.
    // https://eslint.org/docs/rules/no-self-assign
    'no-self-assign': warn,

    // Disallow comparisons where both sides are exactly the same.
    // https://eslint.org/docs/rules/no-self-compare
    'no-self-compare': warn,

    // Disallow comma operators.
    // https://eslint.org/docs/rules/no-sequences
    'no-sequences': warn,

    // Disallow throwing literals as exceptions.
    // https://eslint.org/docs/rules/no-throw-literal
    'no-throw-literal': warn,

    // Disallow unused expressions.
    // https://eslint.org/docs/rules/no-unused-expressions
    'no-unused-expressions': [
      warn,
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],

    // Disallow unused labels.
    // https://eslint.org/docs/rules/no-unused-labels
    'no-unused-labels': warn,

    // Disallow unnecessary calls to .call() and .apply().
    // https://eslint.org/docs/rules/no-useless-call
    'no-useless-call': warn,

    // Disallow unnecessary concatenation of literals or template literals.
    // https://eslint.org/docs/rules/no-useless-concat
    'no-useless-concat': warn,

    // Disallow unnecessary escape characters.
    // https://eslint.org/docs/rules/no-useless-escape
    'no-useless-escape': warn,

    // Disallow redundant return statements.
    // https://eslint.org/docs/rules/no-useless-return
    'no-useless-return': warn,

    // Disallow void operators.
    // https://eslint.org/docs/rules/nod-voi
    'no-void': 'error',

    // Disallow with statements.
    // https://eslint.org/docs/rules/no-with
    'no-with': error,

    // Require using Error objects as Promise rejection reasons.
    // https://eslint.org/docs/rules/prefer-promise-reject-errors
    'prefer-promise-reject-errors': [
      warn,
      {
        allowEmptyReject: true,
      },
    ],

    // Enforce the consistent use of the radix argument when using parseInt().
    // https://eslint.org/docs/rules/radix
    radix: warn,

    // Disallow async functions which have no await expression.
    // https://eslint.org/docs/rules/require-await
    'require-await': warn,

    // Require or disallow “Yoda” conditions.
    // https://eslint.org/docs/rules/yoda
    yoda: warn,

    /**
     * Variables
     *
     * These rules relate to variable declarations.
     */

    // Disallow deleting variables.
    // https://eslint.org/docs/rules/no-delete-var
    'no-delete-var': error,

    // Disallow labels that share a name with a variable.
    // https://eslint.org/docs/rules/no-label-var
    'no-label-var': warn,

    // Disallow specified global variables.
    // https://eslint.org/docs/rules/no-restricted-globals
    'no-restricted-globals': [error].concat(restrictedGlobals),

    // Disallow variable declarations from shadowing variables declared in the outer scope.
    // https://eslint.org/docs/rules/no-shadow
    'no-shadow': warn,

    // Disallow identifiers from shadowing restricted names.
    // https://eslint.org/docs/rules/no-shadow-restricted-names
    'no-shadow-restricted-names': warn,

    // Disallow the use of undeclared variables unless mentioned in /* global */ comments.
    // https://eslint.org/docs/rules/no-undef
    'no-undef': error,

    // Disallow unused variables.
    // https://eslint.org/docs/rules/no-unused-vars
    'no-unused-vars': warn,

    /**
     * Stylistic Issues
     *
     * These rules relate to style guidelines, and are therefore quite subjective:
     */

    // Enforce camelcase naming convention.
    // https://eslint.org/docs/rules/camelcase
    camelcase: [
      warn,
      {
        properties: 'never',
      },
    ],

    // Disallow Array constructors.
    // https://eslint.org/docs/rules/no-array-constructor
    'no-array-constructor': warn,

    // Disallow bitwise operators.
    // https://eslint.org/docs/rules/no-bitwise
    'no-bitwise': warn,

    // Disallow continue statements.
    // https://eslint.org/docs/rules/no-continue
    'no-continue': warn,

    // Disallow if statements as the only statement in else blocks.
    // http://eslint.org/docs/rules/no-lonely-if
    'no-lonely-if': warn,

    // Disallow use of chained assignment expressions.
    // http://eslint.org/docs/rules/no-multi-assign
    'no-multi-assign': warn,

    // Disallow Object constructors.
    // https://eslint.org/docs/rules/no-new-object
    'no-new-object': warn,

    // Disallow the unary operators ++ and --.
    // http://eslint.org/docs/rules/no-plusplus
    'no-plusplus': warn,

    // Disallow dangling underscores in identifiers.
    // https://eslint.org/docs/rules/no-underscore-dangle
    'no-underscore-dangle': warn,

    // Disallow ternary operators when simpler alternatives exist.
    // https://eslint.org/docs/rules/no-unneeded-ternary
    'no-unneeded-ternary': [
      warn,
      {
        defaultAssignment: false,
      },
    ],

    // Enforce variables to be declared either together or separately in functions.
    // https://eslint.org/docs/rules/one-var
    'one-var': [warn, 'never'],

    // Require or disallow Unicode byte order mark (BOM).
    // https://eslint.org/docs/rules/unicode-bom
    'unicode-bom': warn,

    /**
     * ECMAScript 6
     *
     * These rules relate to ES6, also known as ES2015:
     */

    // Require super() calls in constructors.
    // https://eslint.org/docs/rules/constructor-super
    'constructor-super': error,

    // Disallow reassigning class members.
    // https://eslint.org/docs/rules/no-class-assign
    'no-class-assign': warn,

    // Disallow reassigning const variables.
    // https://eslint.org/docs/rules/no-const-assign
    'no-const-assign': error,

    // Disallow duplicate class members
    // https://eslint.org/docs/rules/no-dupe-class-members
    'no-dupe-class-members': warn,

    // Disallow new operators with the Symbol object.
    // https://eslint.org/docs/rules/no-new-symbol
    'no-new-symbol': error,

    // Disallow this/super before calling super() in constructors.
    // https://eslint.org/docs/rules/no-this-before-super
    'no-this-before-super': warn,

    // Disallow unnecessary computed property keys in object literals.
    // https://eslint.org/docs/rules/no-useless-computed-key
    'no-useless-computed-key': warn,

    // Disallow unnecessary constructors.
    // https://eslint.org/docs/rules/no-useless-constructor
    'no-useless-constructor': warn,

    // Disallow renaming import, export, and destructured assignments to the same name.
    // https://eslint.org/docs/rules/no-useless-rename
    'no-useless-rename': warn,

    // Require let or const instead of var
    // https://eslint.org/docs/rules/no-var
    'no-var': warn,

    // Require or disallow method and property shorthand syntax for object literals.
    // https://eslint.org/docs/rules/object-shorthand
    'object-shorthand': [
      warn,
      'always',
      {
        avoidQuotes: true,
      },
    ],

    // Require using arrow functions for callbacks.
    // https://eslint.org/docs/rules/prefer-arrow-callback
    'prefer-arrow-callback': warn,

    // Require const declarations for variables that are never reassigned after declared.
    // https://eslint.org/docs/rules/prefer-const
    'prefer-const': warn,

    // Require destructuring from arrays and/or objects.
    // https://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': warn,

    // Require rest parameters instead of arguments.
    // https://eslint.org/docs/rules/prefer-rest-params
    'prefer-rest-params': warn,

    // Require spread operators instead of .apply().
    // http://eslint.org/docs/rules/prefer-spread
    'prefer-spread': warn,

    // Require template literals instead of string concatenation.
    // http://eslint.org/docs/rules/prefer-template
    'prefer-template': warn,

    // Require generator functions to contain yield.
    // https://eslint.org/docs/rules/require-yield
    'require-yield': warn,

    // Require symbol descriptions.
    // http://eslint.org/docs/rules/symbol-description
    'symbol-description': warn,

    /**
     * eslint-plugin-import
     */

    // Ensure imports point to a file/module that can be resolved.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
    'import/no-unresolved': error,

    // Ensure named imports correspond to a named export in the remote file.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/named.md
    'import/named': error,

    // Ensure a default export is present, given a default import.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/default.md
    'import/default': error,

    // Ensure imported namespaces contain dereferenced properties as they are dereferenced.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/namespace.md
    'import/namespace': error,

    // Forbid Webpack loader syntax in imports.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
    'import/no-webpack-loader-syntax': error,

    // Report any invalid exports, i.e. re-export of the same name.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/export.md
    'import/export': error,

    // Report use of exported name as identifier of default export.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
    'import/no-named-as-default': warn,

    // Report use of exported name as property of default export.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
    'import/no-named-as-default-member': warn,

    // Forbid the use of extraneous packages.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': [
      warn,
      {
        devDependencies: true,
      },
    ],

    // Forbid the use of mutable exports with var or let.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-mutable-exports.md
    'import/no-mutable-exports': warn,

    // Report AMD `require` and `define` calls.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-amd.md
    'import/no-amd': error,

    // Ensure all imports appear before other statements.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md
    'import/first': warn,

    // Report repeated import of the same module in multiple places.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
    'import/no-duplicates': warn,

    // Ensure consistent use of file extension within the import path.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
    'import/extensions': [
      off,
      'always',
      {
        js: 'never',
      },
    ],

    // Enforce a newline after import statements.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md
    'import/newline-after-import': warn,

    // Prefer a default export if module exports a single name.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    'import/prefer-default-export': warn,

    /**
     * eslint-plugin-react
     */

    // Forbid "button" element without an explicit "type" attribute.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/button-has-type.md
    'react/button-has-type': warn,

    // Prevent using this.state inside this.setState.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-access-state-in-setstate.md
    'react/no-access-state-in-setstate': warn,

    // Prevent using Array index in key props.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
    'react/no-array-index-key': warn,

    // Prevent passing children as props.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md
    'react/no-children-prop': warn,

    // Prevent usage of dangerous JSX properties.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
    'react/no-danger': warn,

    // Prevent problem with children and props.dangerouslySetInnerHTML.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md
    'react/no-danger-with-children': warn,

    // Prevent usage of deprecated methods.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
    'react/no-deprecated': warn,

    // Prevent usage of setState in componentDidMount.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-mount-set-state.md
    'react/no-did-mount-set-state': warn,

    // Prevent usage of setState in componentDidUpdate.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
    'react/no-did-update-set-state': warn,

    // Prevent direct mutation of this.state.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
    'react/no-direct-mutation-state': warn,

    // Prevent usage of findDOMNode.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
    'react/no-find-dom-node': warn,

    // Prevent usage of isMounted.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
    'react/no-is-mounted': warn,

    // Prevent usage of shouldComponentUpdate when extending React.PureComponent.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-redundant-should-component-update.md
    'react/no-redundant-should-component-update': warn,

    // Prevent usage of the return value of React.render.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md
    'react/no-render-return-value': warn,

    // Prevent common casing typos.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-typos.md
    'react/no-typos': warn,

    // Prevent using string references in ref attribute.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
    'react/no-string-refs': warn,

    // Prevent invalid characters from appearing in markup.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
    'react/no-unescaped-entities': warn,

    // Prevent usage of unknown DOM property.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
    'react/no-unknown-property': warn,

    // Prevent usage of setState in componentWillUpdate.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-will-update-set-state.md
    'react/no-will-update-set-state': warn,

    // Enforce ES5 or ES6 class for React Components.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md
    'react/prefer-es6-class': warn,

    // Enforce stateless React Components to be written as a pure function.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': warn,

    // Enforce ES5 or ES6 class for returning value in render function.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
    'react/require-render-return': warn,

    // Prevent void DOM elements (e.g. <img />, <br />) from receiving children.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md
    'react/void-dom-elements-no-children': warn,

    // Enforce boolean attributes notation in JSX.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
    'react/jsx-boolean-value': [warn, 'never'],

    // Detect missing key prop.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-key.md
    'react/jsx-key': warn,

    // Prevent comments from being inserted as text nodes.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-comment-textnodes.md
    'react/jsx-no-comment-textnodes': warn,

    // Prevent duplicate properties in JSX.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
    'react/jsx-no-duplicate-props': warn,

    // Prevent usage of unsafe target='_blank'.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md
    'react/jsx-no-target-blank': warn,

    // Disallow undeclared variables in JSX.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
    'react/jsx-no-undef': error,

    // Enforce curly braces or disallow unnecessary curly braces in JSX.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
    'react/jsx-curly-brace-presence': [warn, 'never'],

    // Enforce PascalCase for user-defined JSX components.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
    'react/jsx-pascal-case': warn,

    // Prevent React to be incorrectly marked as unused.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
    'react/jsx-uses-react': warn,

    // Prevent variables used in JSX to be incorrectly marked as unused
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
    'react/jsx-uses-vars': warn,

    /**
     * eslint-plugin-jsx-a11y
     */

    // Enforce emojis are wrapped in and provide screenreader access.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/accessible-emoji
    'jsx-a11y/accessible-emoji': warn,

    // Enforce all elements that require alternative text have meaningful information to relay back to end user.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/alt-text
    'jsx-a11y/alt-text': warn,

    // Enforce all anchors to contain accessible content.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-has-content
    'jsx-a11y/anchor-has-content': [
      warn,
      {
        components: ['Link'],
      },
    ],

    // Enforce all anchors are valid, navigable elements.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid
    'jsx-a11y/anchor-is-valid': [
      warn,
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],

    // Enforce elements with aria-activedescendant are tabbable.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-activedescendant-has-tabindex
    'jsx-a11y/aria-activedescendant-has-tabindex': warn,

    // Enforce all aria-* props are valid.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-props
    'jsx-a11y/aria-props': warn,

    // Enforce ARIA state and property values are valid.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-proptypes
    'jsx-a11y/aria-proptypes': warn,

    // Enforce that elements with ARIA roles must use a valid, non-abstract ARIA role.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-role
    'jsx-a11y/aria-role': warn,

    // Enforce that elements that do not support ARIA roles, states, and properties do not have those attributes.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-unsupported-elements
    'jsx-a11y/aria-unsupported-elements': warn,

    // Enforce a clickable non-interactive element has at least one keyboard event listener.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events
    'jsx-a11y/click-events-have-key-events': warn,

    // Enforce heading (h1, h2, etc) elements contain accessible content.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/heading-has-content
    'jsx-a11y/heading-has-content': warn,

    // Enforce <html> element has lang prop.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/html-has-lang
    'jsx-a11y/html-has-lang': warn,

    // Enforce iframe elements have a title attribute.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/iframe-has-title
    'jsx-a11y/iframe-has-title': warn,

    // Enforce <img> alt prop does not contain the word "image", "picture", or "photo".
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-redundant-alt
    'jsx-a11y/img-redundant-alt': warn,

    // Enforce that elements with interactive handlers like onClick must be focusable.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/interactive-supports-focus
    'jsx-a11y/interactive-supports-focus': warn,

    // Enforce that <label> elements have the htmlFor prop.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for
    'jsx-a11y/label-has-for': warn,

    // Enforce lang attribute has a valid value.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/lang
    'jsx-a11y/lang': warn,

    // Enforces that <audio> and <video> elements must have a <track> for captions.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption
    'jsx-a11y/media-has-caption': warn,

    // Enforce that onMouseOver/onMouseOut are accompanied by onFocus/onBlur for keyboard-only users.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events
    'jsx-a11y/mouse-events-have-key-events': warn,

    // Enforce that the accessKey prop is not used on any element to avoid complications with keyboard commands used by a screenreader.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-access-key
    'jsx-a11y/no-access-key': warn,

    // Enforce autoFocus prop is not used.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus
    'jsx-a11y/no-autofocus': warn,

    // Enforce distracting elements are not used.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-distracting-elements
    'jsx-a11y/no-distracting-elements': warn,

    // Interactive elements should not be assigned non-interactive roles.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-interactive-element-to-noninteractive-role
    'jsx-a11y/no-interactive-element-to-noninteractive-role': warn,

    // Non-interactive elements should not be assigned mouse or keyboard event listeners.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-interactions
    'jsx-a11y/no-noninteractive-element-interactions': warn,

    // Non-interactive elements should not be assigned interactive roles.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-to-interactive-role
    'jsx-a11y/no-noninteractive-element-to-interactive-role': warn,

    // tabIndex should only be declared on interactive elements.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-tabindex
    'jsx-a11y/no-noninteractive-tabindex': warn,

    // Enforce usage of onBlur over onChange on select menus for accessibility.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-onchange
    'jsx-a11y/no-onchange': warn,

    // Enforce explicit role property is not the same as implicit/default role property on element.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-redundant-roles
    'jsx-a11y/no-redundant-roles': warn,

    // Enforce that non-interactive, visible elements (such as <div>) that have click handlers use the role attribute.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions
    'jsx-a11y/no-static-element-interactions': warn,

    // Enforce that elements with ARIA roles must have all required attributes for that role.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-has-required-aria-props
    'jsx-a11y/role-has-required-aria-props': warn,

    // Enforce that elements with explicit or implicit roles defined contain only aria-* properties supported by that role.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-supports-aria-props
    'jsx-a11y/role-supports-aria-props': warn,

    // Enforce scope prop is only used on <th> elements.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/scope
    'jsx-a11y/scope': warn,

    // Enforce tabIndex value is not greater than zero.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/tabindex-no-positive
    'jsx-a11y/tabindex-no-positive': warn,
  },
  overrides: [
    {
      files: 'packages/playgrounds-runtime/**/*.js',
      env: {
        browser: true,
        node: false,
      },
      rules: {
        /**
         * Variables
         *
         * These rules relate to variable declarations.
         */

        // Disallow unused variables.
        // https://eslint.org/docs/rules/no-unused-vars
        'no-unused-vars': [
          warn,
          {
            varsIgnorePattern: 'h',
          },
        ],

        /**
         * eslint-plugin-import
         */

        // Forbid the use of extraneous packages.
        // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
        'import/no-extraneous-dependencies': [
          warn,
          {
            devDependencies: true,
          },
        ],
      },
    },
    {
      files: 'packages/playgrounds-server/src/hotClient.js',
      parserOptions: {
        ecmaVersion: 5,
      },
      env: {
        browser: true,
        node: false,
      },
      globals: {
        process: true,
        module: true,
      },
      rules: {
        /**
         * ECMAScript 6
         *
         * These rules relate to ES6, also known as ES2015:
         */

        // Require let or const instead of var
        // https://eslint.org/docs/rules/no-var
        'no-var': off,

        // Require using arrow functions for callbacks.
        // https://eslint.org/docs/rules/prefer-arrow-callback
        'prefer-arrow-callback': off,
      },
    },
  ],
}

module.exports = config
