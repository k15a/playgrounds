// Native
const path = require('path')
const os = require('os')

// Packages
const chalk = require('chalk')
const inquirer = require('inquirer')
const opn = require('opn')
const server = require('@playgrounds/server')
const launchEditor = require('launch-editor')
const clearConsole = require('console-clear')

// Files
const formatString = require('../utils/formatString')
const greeting = require('../utils/greeting')
const getProjects = require('../utils/getProjects')
const paths = require('../utils/paths')

const aliases = ['view', 'show']

const help = formatString`

  ${greeting(process.env.USER)}

  it looks like you have problems running the open command. 😋

  The open command will open an existing playground for you.
  Under the hood we start a development server and
  open your browser and editor for you.

  Here are a few ways you can open a playground.

    - Open a playground you select from a list:

      {cyan $ playgrounds open} {dim or}
      {cyan $ playgrounds opn} {dim or}
      {cyan $ playgrounds view} {dim or}
      {cyan $ playgrounds show}

    - Open a playground based on the name:

      {cyan $ playgrounds open <name>}
      {cyan $ playgrounds open hello-world}

    - Open a playground based on the id:

      {cyan $ playgrounds open <id>}
      {cyan $ playgrounds open ByRnd7aSM}

`

async function selectProjectFromList(projects) {
  const { projectId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectId',
      message: 'Which playground should we open for you?',
      pageSize: 10,
      choices: projects.map(({ id, name, createdAt }) => {
        const date = new Date(createdAt).toLocaleString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        return {
          name: chalk`${name} {dim - ${date} - ${id}}`,
          value: id,
          short: name,
        }
      }),
    },
  ])

  return projectId
}

async function getProjectId(id) {
  const projects = await getProjects()

  if (projects.length === 0) {
    console.log(formatString`

      You don't have any playgrounds yet. 🤒
      Don't worry you can always create one with:

        $ {cyan playgrounds create}

    `)
    process.exit(1)
  }

  if (!id) {
    console.log(formatString`

      You didn't specify the name or id of the playground you want to open.
      Please select the right playground from the list below. 🙂

    `)
    return await selectProjectFromList(projects)
  }

  if (!projects.find(project => project.id === id)) {
    const matchingProjects = projects.filter(
      project => project.name.includes(id) || project.id.includes(id),
    )

    if (matchingProjects.length === 0) {
      console.log(formatString`

        We cannot find playground with the name or id {red ${id}}. 😕
        Please select the right playground from the list below.

      `)

      return await selectProjectFromList(projects)
    }

    if (matchingProjects.length === 1) {
      return matchingProjects[0].id
    }

    console.log(formatString`

      There are multiple playgrounds with the name or id {green ${id}}. 😋
      Please select the right playground from the list below.

    `)

    return await selectProjectFromList(matchingProjects)
  }

  return id
}

async function open(args) {
  const id = await getProjectId(args[0])

  const projectDir = path.join(paths.projects, id)
  const pkg = require(path.join(projectDir, 'package.json'))
  const sourceDir = path.join(projectDir, pkg.meta.name)

  const port = await server({
    projectDir,
    sourceDir,
  })

  clearConsole(true)
  console.log(formatString`

    {dim </> Playgrounds}

    We've opened the playground {magenta ${pkg.meta.name}} for you. 😋

    Normally your browser and editor should open automatically.

    If this didn't work please navigate your browser to:
      {cyan http://localhost:${port}} 🦄

    And open your code editor at:
      {cyan ${sourceDir.replace(os.homedir(), '~')}}

  `)

  opn(`http://localhost:${port}`)
  launchEditor(sourceDir)
}

module.exports = {
  aliases,
  help,
  command: open,
}
