// Files
const formatString = require('./utils/formatString')
const greeting = require('./utils/greeting')
const leet = require('./utils/leet')

// Commands
const create = require('./commands/create')
const open = require('./commands/open')
const list = require('./commands/list')
const remove = require('./commands/remove')

const commands = {
  create,
  open,
  list,
  remove,
}

const aliases = Object.entries(commands).reduce(
  (acc, [command, { aliases: commandAliases }]) =>
    commandAliases
      ? Object.assign(
          {},
          acc,
          ...commandAliases.map(alias => ({
            [alias]: commands[command],
          })),
        )
      : acc,
  {},
)

function getCommand(command) {
  if (command in commands) {
    return commands[command]
  }

  if (command in aliases) {
    return aliases[command]
  }

  return false
}

const help = formatString`

  {dim </> Playgrounds}

  ${greeting(process.env.USER)}

  Playgrounds is a way to quickly prototype ideas and try out something new.
  It's like codesandbox or webpackbin in your own editor and terminal.

  {cyan playgrounds} <command> [options] <arguments>

  {dim Commands}

    - {cyan create}      Create a new playground
    - {cyan open}        Open an existing playground
    - {cyan list}        Show all playgrounds
    - {cyan remove}      Remove a playground

  {dim Examples}

    - Create a new playground

      {cyan $ playgrounds}

    - Create a new react playground

      {cyan $ playgrounds --template react}

    - List all playgrounds

      {cyan $ playgrounds list}

    - Open a playground

      {cyan $ playgrounds open hello-world}

    - Show more information about the create command

      {cyan $ playgrounds help create}

`

async function run(command, args, flags) {
  if (command === 'help') {
    const showLeet = flags.leet || flags['1337']
    const cmd = getCommand(args[0])

    if (cmd) {
      console.log(showLeet ? leet(cmd.help) : cmd.help)
      console.log(formatString`

        If you have more questions about the {cyan ${
          args[0]
        }} command create an issue on GitHub:
          {green https://github.com/k15a/playgrounds/issues/new}
        Or send me a message on Twitter:
          {green https://twitter.com/_konsch}

      `)
      process.exit()
    }

    console.log(showLeet ? leet(help) : help)
    console.log(formatString`

      If you have more questions about the playgrounds create an issue on GitHub:
        {green https://github.com/k15a/playgrounds/issues/new} 🐙
      Or send me a message on Twitter:
        {green https://twitter.com/k15a} 🐦

      I ♥️  to hear from you.

    `)
    process.exit()
  }

  const cmd = getCommand(command)

  if (cmd) {
    return cmd.command(args, flags)
  }

  return await create.command([command, ...args], flags)
}

module.exports = run
