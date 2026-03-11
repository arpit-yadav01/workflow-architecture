const Workflow = require("../models/Workflow")
const WorkflowRun = require("../models/WorkflowRun")
const StepRun = require("../models/StepRun")
const eventBus = require("../services/eventBus")
const { executeStep } = require("./stepExecutor")

async function runWorkflow(workflowId, input = {}) {

  const workflow = await Workflow.findById(workflowId)

  if (!workflow) {
    throw new Error("Workflow not found")
  }

  const run = await WorkflowRun.create({
    workflowId,
    ownerId: workflow.ownerId,
    status: "running",
    startedAt: new Date(),
    input
  })

  const context = { ...input }

  const steps = workflow.steps

  const stepMap = {}
  const dependencyCount = {}
  const dependents = {}

  // Build dependency maps
  steps.forEach(step => {

    stepMap[step.stepId] = step
    dependencyCount[step.stepId] = step.dependsOn?.length || 0

    step.dependsOn?.forEach(dep => {

      if (!dependents[dep]) dependents[dep] = []
      dependents[dep].push(step.stepId)

    })

  })

  // Find initial runnable steps
  const readyQueue = []

  Object.keys(dependencyCount).forEach(stepId => {

    if (dependencyCount[stepId] === 0) {
      readyQueue.push(stepId)
    }

  })

  // Parallel scheduler
  while (readyQueue.length > 0) {

    const currentBatch = [...readyQueue]
    readyQueue.length = 0

    await Promise.all(

      currentBatch.map(async stepId => {

        const step = stepMap[stepId]

        const stepRun = await StepRun.create({
          runId: run._id,
          stepId,
          status: "running",
          startedAt: new Date()
        })

        // 🔵 Emit running event
        eventBus.emit("stepUpdate", {
          runId: run._id,
          stepId,
          status: "running"
        })
        eventBus.emit("stepUpdate", {
  runId: run._id,
  stepId,
  status: "running"
})

console.log("EVENT EMITTED:", stepId, "running")

        try {

          const output = await executeStep(step, context)

          context[stepId] = output

          stepRun.status = "success"
          stepRun.output = output
          stepRun.finishedAt = new Date()

          await stepRun.save()

          // 🟢 Emit success event
          eventBus.emit("stepUpdate", {
            runId: run._id,
            stepId,
            status: "success"
          })

          // Unlock dependent steps
          if (dependents[stepId]) {

            dependents[stepId].forEach(nextStep => {

              dependencyCount[nextStep]--

              if (dependencyCount[nextStep] === 0) {
                readyQueue.push(nextStep)
              }

            })

          }

        } catch (error) {

          stepRun.status = "failed"
          stepRun.error = error.message
          stepRun.finishedAt = new Date()

          await stepRun.save()

          // 🔴 Emit failed event
          eventBus.emit("stepUpdate", {
            runId: run._id,
            stepId,
            status: "failed"
          })

          run.status = "failed"
          run.finishedAt = new Date()

          await run.save()

          throw error
        }

      })

    )

  }

  run.status = "success"
  run.finishedAt = new Date()

  await run.save()

  return run
}

module.exports = {
  runWorkflow
}