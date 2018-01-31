// Packages
const chalk = require('chalk')
const chalkTemplates = require('chalk/templates')
const dedent = require('dedent-js')
const redent = require('redent')

function formatString(...args) {
  const string = dedent(...args)
  const coloredString = chalkTemplates(chalk, string)
  return redent(coloredString, 2)
}

module.exports = formatString
