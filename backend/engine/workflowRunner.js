const Workflow = require("../models/Workflow")
const WorkflowRun = require("../models/WorkflowRun")
const StepRun = require("../models/StepRun")

const { validateAndSortDAG } = require("./dagEngine")
const { executeStep } = require("./stepExecutor")

async function runWorkflow(workflowId, input = {}) {

  const workflow = await Workflow.findById(workflowId)

  const order = validateAndSortDAG(workflow.steps)

  const run = await WorkflowRun.create({
    workflowId,
    ownerId: workflow.ownerId,
    status: "running",
    startedAt: new Date(),
    input
  })

  const context = { ...input }

  for (const stepId of order) {

    const step = workflow.steps.find(s => s.stepId === stepId)

    const stepRun = await StepRun.create({
      runId: run._id,
      stepId,
      status: "running",
      startedAt: new Date()
    })

    try {

      const output = await executeStep(step, context)

      context[stepId] = output

      stepRun.status = "success"
      stepRun.output = output
      stepRun.finishedAt = new Date()

      await stepRun.save()

    } catch (error) {

      stepRun.status = "failed"
      stepRun.error = error.message
      stepRun.finishedAt = new Date()

      await stepRun.save()

      run.status = "failed"
      await run.save()

      throw error
    }

  }

  run.status = "success"
  run.finishedAt = new Date()

  await run.save()

  return run

}

module.exports = {
  runWorkflow
}