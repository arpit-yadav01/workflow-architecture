function validateAndSortDAG(steps) {

  const graph = {}
  const inDegree = {}

  // initialize
  steps.forEach(step => {
    graph[step.stepId] = []
    inDegree[step.stepId] = 0
  })

  // build graph
  steps.forEach(step => {
    if (step.dependsOn) {
      step.dependsOn.forEach(dep => {

        if (!graph[dep]) {
          throw new Error(`Invalid dependency: ${dep}`)
        }

        graph[dep].push(step.stepId)
        inDegree[step.stepId]++

      })
    }
  })

  const queue = []
  const result = []

  for (let node in inDegree) {
    if (inDegree[node] === 0) {
      queue.push(node)
    }
  }

  while (queue.length > 0) {

    const current = queue.shift()
    result.push(current)

    graph[current].forEach(neighbor => {

      inDegree[neighbor]--

      if (inDegree[neighbor] === 0) {
        queue.push(neighbor)
      }

    })
  }

  if (result.length !== steps.length) {
    throw new Error("Cycle detected in workflow")
  }

  return result
}

module.exports = {
  validateAndSortDAG
}