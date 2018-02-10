// Native
const path = require('path')

// Packages
const babylon = require('babylon')
const babel = require('@babel/core')
const cf = require('@babel/code-frame')
const loaderUtils = require('loader-utils')

const removeEmpty = array => array.filter(value => value !== null)
const addCond = (cond, value) => (cond ? value : null)

class BabelLoaderError extends Error {
  constructor({ message, hideStack, error }) {
    super()

    this.name = 'BabelLoaderError'
    this.message = message
    this.hideStack = hideStack
    this.error = error

    Error.captureStackTrace(this, BabelLoaderError)
  }
}

const babylonPlugins = [
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
]

function parse({ filename, code, isFlow, isTypescript }) {
  try {
    return babylon.parse(code, {
      sourceType: 'module',
      sourceFilename: filename,
      plugins: removeEmpty([
        addCond(isFlow, 'flow'),
        addCond(isFlow, 'flowComments'),
        addCond(isTypescript, 'typescript'),

        ...babylonPlugins,
      ]),
    })
  } catch (error) {
    if (error.loc) {
      const isSyntaxError = error instanceof SyntaxError
      const isTypeError = error instanceof TypeError

      const location = {
        start: {
          line: error.loc.line,
          column: error.loc.column + 1,
        },
      }

      const codeFrame = cf.codeFrameColumns(code, location, {
        forceColor: true,
      })

      const name = isSyntaxError ? 'SyntaxError: ' : ''
      throw new BabelLoaderError({
        message: `${name + error.message}\n\n${codeFrame}\n`,
        hideStack: isSyntaxError || isTypeError,
        error,
      })
    }

    throw error
  }
}

function loader(code) {
  const options = loaderUtils.getOptions(this)
  const filename = path.relative(options.sourceDir, this.resourcePath)

  const isFlow = /^(\/\/\s*@flow|\/\*\s*@flow\s*\*\/)/.test(code)
  const isTypescript = /\.(ts|tsx)$/.test(path)

  const ast = parse({
    filename,
    code,
    isFlow,
    isTypescript,
  })

  const dependencies = new Set(
    ast.program.body
      .filter(node => node.type === 'ImportDeclaration')
      .map(node => {
        const name = node.source.value
        return name
          .split('/')
          .slice(0, name.startsWith('@') ? 2 : 1)
          .join('/')
      }),
  )

  const isReact = dependencies.has('react')
  const isPreact = dependencies.has('preact')
  const isInferno = dependencies.has('inferno')
  const isStyledComponents = dependencies.has('styled-components')

  const presets = removeEmpty([
    [
      require.resolve('@babel/preset-env'),
      {
        modules: false,
      },
    ],
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
    filename,
    presets,
    plugins,
  })
  return output.code
}

module.exports = loader
