// Packages
const minimist = require('minimist')
const fs = require('fs-extra')
const PrettyError = require('pretty-error')
const updateNotifier = require('update-notifier')

// Files
const pkg = require('../package.json')
const formatString = require('./utils/formatString')
const paths = require('./utils/paths')
const run = require('./command')

async function main(argv) {
  const { _: input, ...flags } = minimist(argv, {
    boolean: ['help'],
    alias: {
      help: 'h',
    },
  })

  await fs.ensureDir(paths.projects)

  const [command, ...args] = input

  if (flags.help) {
    return run('help', input, flags)
  }

  return run(command, args, flags)
}

const pe = new PrettyError()
function handleError(error) {
  console.log(pe.render(error))
  console.log(formatString`

    We are so sorry that playgrounds crashed. 😿
    {cyan Please create an issue at {green https://github.com/k15a/playgrounds/issues/new}}

  `)
  process.exit(1)
}

process.on('unhandledRejection', handleError)
process.on('uncaughtException', handleError)

main(process.argv.splice(2)).catch(handleError)
updateNotifier({ pkg }).notify()
