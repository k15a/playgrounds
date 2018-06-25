#!/usr/bin/env node

// eslint-disable-next-line
var semver = require('semver')

if (semver.gte(process.version, '8.6.0')) {
  require('use-strict')
  require('../src/index')
} else {
  console.log('Hey,')
  console.log("we currently don't support your Node version. 😢")
  console.log('Please update to Node version 8.6 or above to use playgrounds.')
  process.exit(1)
}
