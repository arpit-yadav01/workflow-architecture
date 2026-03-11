const { runWorkflow } = require("../engine/workflowRunner")

const WorkflowRun = require("../models/WorkflowRun")
const StepRun = require("../models/StepRun")


// Trigger workflow
exports.triggerWorkflow = async (req, res) => {

  try {

    const workflowId = req.params.id
    const input = req.body || {}

    const run = await runWorkflow(workflowId, input)

    res.json(run)

  } catch (error) {

    res.status(200).json({
      message: "Workflow completed with errors",
      error: error.message
    })

  }

}


// List all runs
exports.getRuns = async (req, res) => {

  try {

    const runs = await WorkflowRun.find({
      ownerId: req.user.id
    }).sort({ createdAt: -1 })

    res.json(runs)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}


// Get run details
exports.getRunDetail = async (req, res) => {

  try {

    const run = await WorkflowRun.findById(req.params.id)

    const steps = await StepRun.find({
      runId: req.params.id
    })

    res.json({
      run,
      steps
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}


// Get single step
exports.getStepDetail = async (req, res) => {

  try {

    const step = await StepRun.findOne({
      runId: req.params.id,
      stepId: req.params.stepId
    })

    res.json(step)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}


// Cancel running workflow
exports.cancelRun = async (req, res) => {

  try {

    const run = await WorkflowRun.findById(req.params.id)

    if (!run) {
      return res.status(404).json({
        message: "Run not found"
      })
    }

    if (run.status !== "running") {
      return res.status(400).json({
        message: "Run is not active"
      })
    }

    run.status = "cancelled"
    run.finishedAt = new Date()

    await run.save()

    res.json({
      message: "Workflow cancelled"
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}