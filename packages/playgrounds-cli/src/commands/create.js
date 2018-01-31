// Native
const path = require('path')

// Packages
const shortId = require('shortid')
const fs = require('fs-extra')
const inquirer = require('inquirer')

// Files
const formatString = require('../utils/formatString')
const generateName = require('../utils/generateName')
const getProjects = require('../utils/getProjects')
const greeting = require('../utils/greeting')
const open = require('./open')
const paths = require('../utils/paths')
const stringify = require('../utils/stringify')
const templates = require('../utils/templates')

const aliases = ['new']

const help = formatString`

  ${greeting(process.env.USER)}

  it looks like you have problems running the create command. 😋

  The create command is the default command of playgrounds. It will create a
  new playground for you and opens it in your editor and browser afterwards.

  Here are some examples how you can use the create command:

    - Create a new playgrounds with a random name

      {cyan $ playgrounds} {dim or}
      {cyan $ playgrounds create} {dim or}
      {cyan $ playgrounds new}

    - Create a new playgrounds with a given name

      {cyan $ playgrounds create <name>}
      {cyan $ playgrounds create hello-world}

    - Create a new playground with a template

      {cyan $ playgrounds create --template <template>}
      {cyan $ playgrounds create --template react}

`

async function getProjectName(name) {
  if (!name) {
    return generateName()
  }

  const projects = await getProjects()

  if (projects.find(project => project.name === name)) {
    console.log(formatString`

      You already have a playground with the name {red ${name}}. This is
      not a problem for us but it's harder for you to find the correct
      playground when you want to open it again.

    `)

    const { renameProject, selectedName } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'renameProject',
        message: 'Do you want to rename the playground?',
        default: false,
      },
      {
        type: 'input',
        name: 'selectedName',
        message: 'How should we name the new playground?',
        default: name,
        when: result => result.renameProject,
      },
    ])

    if (renameProject) {
      return await getProjectName(selectedName)
    }
  }

  return name
}

async function getTemplateDir(template) {
  if (!template) {
    return await getTemplateDir('blank')
  }

  const defaultTemplates = await templates.getDefault()
  const customTemplates = await templates.getCustom()
  const allTemplates = [...defaultTemplates, ...customTemplates]

  if (customTemplates.includes(template)) {
    return path.join(paths.customTemplates, template)
  }

  if (defaultTemplates.includes(template)) {
    return path.join(paths.defaultTemplates, template)
  }

  console.log(formatString`

    Can't find template {red ${template}} 😔
    Please select the correct template from the list below.

  `)

  const { templateName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'templateName',
      message: 'Which template should we use?',
      pageSize: 10,
      default: allTemplates.findIndex(
        currentTemplateName => currentTemplateName === 'blank',
      ),
      choices: allTemplates,
    },
  ])

  return await getTemplateDir(templateName)
}

async function create(args, flags) {
  const name = await getProjectName(args[0])
  const templateDir = await getTemplateDir(flags.template)
  const id = shortId()

  const projectDir = path.join(paths.projects, id)
  const sourceDir = path.join(projectDir, name)

  const pkg = {
    version: '1.0.0',
    name: id,
    meta: {
      id,
      name,
      createdAt: Date.now(),
    },
  }

  await fs.ensureDir(projectDir)

  await fs.writeFile(path.join(projectDir, 'package.json'), stringify(pkg))
  await fs.copy(templateDir, sourceDir)

  return await open.command([id], flags)
}

module.exports = {
  aliases,
  help,
  command: create,
}
