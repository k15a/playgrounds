// Native
const path = require('path')

// Packages
const babel = require('@babel/core')
const loaderUtils = require('loader-utils')

const removeEmpty = array => array.filter(value => value !== null)
const addCond = (cond, value) => (cond ? value : null)

function loader(code) {
  const options = loaderUtils.getOptions(this)
  const filename = path.relative(options.sourceDir, this.resourcePath)

  const isFlow = /^(\/\/\s*@flow|\/\*\s*@flow\s*\*\/)/.test(code)
  const isTypescript = /\.(ts|tsx)$/.test(path)

  const hasDependency = dependency => {
    const regex = new RegExp(`from\\s*["']${dependency}[\\w/]*["']`)
    return regex.test(code)
  }

  const isReact = hasDependency('react')
  const isPreact = hasDependency('preact')
  const isInferno = hasDependency('inferno')
  const isStyledComponents = hasDependency('styled-components')

  const presets = removeEmpty([
    [
      require.resolve('@babel/preset-env'),
      {
        modules: false,
      },
    ],
    [
      require.resolve('@babel/preset-stage-0'),
      {
        decoratorsLegacy: true,
      },
    ],

    addCond(isFlow, require.resolve('@babel/preset-flow')),
    addCond(isReact, require.resolve('@babel/preset-react')),
    addCond(isTypescript, require.resolve('@babel/preset-typescript')),
  ])

  const plugins = removeEmpty([
    // require.resolve('babel-plugin-macros'),

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

  const output = babel.transformSync(code, {
    babelrc: false,
    filename,
    presets,
    plugins,
  })

  return output.code
}

module.exports = loader
