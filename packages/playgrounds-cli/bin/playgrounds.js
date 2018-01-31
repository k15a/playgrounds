#!/usr/bin/env node --use_strict

// eslint-disable-next-line
var semver = require('semver')

if (semver.gte(process.version, '8.6.0')) {
  require('../src/index')
} else {
  console.log('Hey,')
  console.log("we currently don't support your Node version. 😢")
  console.log('Please update to Node version 8.6 or above to use playgrounds.')
  process.exit(1)
}
