// Packages
const babylon = require('babylon')
const babel = require('@babel/core')

const removeEmpty = array => array.filter(value => value !== null)
const addCond = (cond, value) => (cond ? value : null)

function loader(code) {
  const path = this.request
  const isTypescript = /\.ts$/.test(path) // add tsx
  const isFlow = /^(?:\/\/\s*flow|\/\*\s*flow\s*\*\/)/.test(code)

  const ast = babylon.parse(code, {
    sourceType: 'module',
    plugins: removeEmpty([
      addCond(isTypescript, 'typescript'),
      addCond(isFlow, 'flow'),
      addCond(isFlow, 'flowComments'),

      'asyncGenerators',
      'bigInt',
      'classPrivateMethods',
      'classPrivateProperties',
      'classProperties',
      'decorators',
      'doExpressions',
      'dynamicImport',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'functionBind',
      'functionSent',
      'importMeta',
      'jsx',
      'nullishCoalescingOperator',
      'numericSeparator',
      'objectRestSpread',
      'optionalCatchBinding',
      'optionalChaining',
      'pipelineOperator',
      'throwExpressions',
    ]),
  })

  const dependencies = new Set(
    ast.program.body
      .filter(node => node.type === 'ImportDeclaration')
      .map(node => node.source.value),
  )

  const isReact = dependencies.has('react')
  const isPreact = dependencies.has('preact')
  const isInferno = dependencies.has('inferno')
  const isStyledComponents = dependencies.has('styled-components')

  const presets = removeEmpty([
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-stage-0'),

    addCond(isFlow, require.resolve('@babel/preset-flow')),
    addCond(isReact, require.resolve('@babel/preset-react')),
    addCond(isTypescript, require.resolve('@babel/preset-typescript')),
  ])

  const plugins = removeEmpty([
    require.resolve('babel-plugin-macros'),

    addCond(
      isStyledComponents,
      require.resolve('babel-plugin-styled-components'),
    ),

    addCond(isPreact, [
      require.resolve('@babel/plugin-transform-react-jsx'),
      {
        pragma: 'h',
      },
    ]),

    addCond(isInferno, require.resolve('babel-plugin-inferno')),
  ])

  const output = babel.transformFromAstSync(ast, code, {
    babelrc: false,
    filename: path,
    presets,
    plugins,
  })
  return output.code
}

module.exports = loader
