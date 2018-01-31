// Packages
const columnify = require('columnify')
const chalk = require('chalk')
const redent = require('redent')

// Files
const formatString = require('../utils/formatString')
const greeting = require('../utils/greeting')
const getProjects = require('../utils/getProjects')
const filterProjects = require('../utils/filterProjects')

const aliases = ['ls']

const help = formatString`

  ${greeting(process.env.USER)}

  it looks like you have problems running the list command. ☺️
  The list command will show you all playgrounds that are available to you.

  Here are some examples how you can use the list command:

    - List all playgrounds

      {cyan $ playgrounds list} {dim or}
      {cyan $ playgrounds ls}

    - Search for playgrounds

      {cyan $ playgrounds list <id>}
      {cyan $ playgrounds list <name>}
      {cyan $ playgrounds list hello-world}

`

function listProjects(projects) {
  const output = columnify(projects, {
    columns: ['id', 'name', 'createdAt'],

    config: {
      id: {
        dataTransform(id) {
          return chalk.dim(id)
        },
        headingTransform() {
          return 'Id'
        },
      },
      name: {
        headingTransform() {
          return 'Name'
        },
      },
      createdAt: {
        dataTransform(createdAt) {
          return chalk.dim(
            new Date(Number(createdAt)).toLocaleString(undefined, {
              weekday: 'short',
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            }),
          )
        },
        headingTransform() {
          return 'Created at'
        },
      },
    },
  })

  console.log(redent(output, 4))
  console.log(formatString`

    You can open a playground with:

      {cyan $ playgrounds open <id>} {dim or}
      {cyan $ playgrounds open <name>}

    And you can delete a playground with:

      {cyan $ playgrounds remove <id>} {dim or}
      {cyan $ playgrounds remove <name>}

  `)
}

async function list(filters) {
  const projects = await getProjects()

  console.log(formatString`

    These are all the projects we could find 🕵️‍♂️

  `)

  if (filters.length > 0) {
    return listProjects(filterProjects(filters, projects))
  }

  return listProjects(projects)
}

module.exports = {
  aliases,
  help,
  command: list,
}
