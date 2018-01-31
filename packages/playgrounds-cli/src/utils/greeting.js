// Packages
const chalk = require('chalk')

// Files
const randomArrayItem = require('./randomArrayItem')

const greetings = [
  'Hello',
  'Hey',
  'Hi',
  'Yo',
  'G’day',
  'Hiya',
  'Howdy',
  'What’s up',
  'What’s new',
  'What’s going on',
  'Good to see you',
  'Nice to see you',
  'How’s it going',
  'It’s nice to meet you',
]

function greeting(name) {
  return `${randomArrayItem(greetings)} ${chalk.green(name)},`
}

module.exports = greeting
