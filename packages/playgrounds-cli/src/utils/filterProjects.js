function filterProjects(filters, projects) {
  return projects.filter(project =>
    filters.reduce((match, filter) => {
      if (match) {
        return true
      }

      if (project.id.includes(filter)) {
        return true
      }

      if (project.name.includes(filter)) {
        return true
      }

      return false
    }, false),
  )
}

module.exports = filterProjects
