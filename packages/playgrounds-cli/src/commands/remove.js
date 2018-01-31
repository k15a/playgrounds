// Native
const path = require('path')

// Packages
const inquirer = require('inquirer')
const chalk = require('chalk')
const trash = require('trash')
const fs = require('fs-extra')

// Files
const filterProjects = require('../utils/filterProjects')
const formatString = require('../utils/formatString')
const getProjects = require('../utils/getProjects')
const greeting = require('../utils/greeting')
const paths = require('../utils/paths')

const aliases = ['rm', 'delete', 'del']

const help = formatString`

  ${greeting(process.env.USER)}

  it looks like you have problems running the remove command. 😚

  This command will remove a playground for you if you no longer need it.
  We will try to move the playground to the trash. If this is not working we
  will delete it permanently.

  Here are some examples how you can remove playgrounds:

    - Remove a playground you select from a list:

      {cyan $ playgrounds remove}
      {cyan $ playgrounds rm} {dim or}
      {cyan $ playgrounds delete} {dim or}
      {cyan $ playgrounds del} {dim or}

    - Remove a playground based on the name:

      {cyan $ playgrounds remove <name>}
      {cyan $ playgrounds remove hello-world}

    - Remove a playground based on the id:

      {cyan $ playgrounds remove <id>}
      {cyan $ playgrounds remove SJdzPzpBf}

`

async function remove(filters) {
  const projects = await getProjects()
  const checkedProjects = filterProjects(filters, projects)

  if (projects.length === 0) {
    console.log(formatString`

      You don't have any playgrounds you could remove. 🙂
      If you want to create one you can always do this with:

        {cyan $ playgrounds create}

    `)
    process.exit(0)
  }

  console.log(formatString`

    Please select the playgrounds you want to remove. 🗑

  `)

  const { selectedProjects, removeProjects } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedProjects',
      message: 'Which playgrounds should we remove for you?',
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
          checked: checkedProjects.find(
            ({ id: checkedId }) => id === checkedId,
          ),
        }
      }),
    },
    {
      type: 'confirm',
      name: 'removeProjects',
      message: 'Are you sure that you want to remove the playgrounds?',
      default: false,
    },
  ])

  if (removeProjects && selectedProjects.length > 0) {
    const selectedPaths = selectedProjects.map(id =>
      path.join(paths.projects, id),
    )

    try {
      await trash(selectedPaths)
    } catch (error) {
      await Promise.all(
        selectedPaths.map(selectedPath => fs.remove(selectedPath)),
      )
    }

    console.log(formatString`

      We've succesfully removed the playgrounds. {green ✓}
      Go create some new with:

        {cyan $ playgrounds create}

    `)
    process.exit(0)
  }

  console.log(formatString`

    Phew, that was close 😰

  `)
}

module.exports = {
  aliases,
  help,
  command: remove,
}
