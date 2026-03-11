const Workflow = require("../models/Workflow")
const { validateAndSortDAG } = require("../engine/dagEngine")

// Create workflow
exports.createWorkflow = async (req, res) => {

  try {

    const { name, description, steps } = req.body

    // Validate DAG
    validateAndSortDAG(steps)

    const workflow = await Workflow.create({
      ownerId: req.user.id,
      name,
      description,
      steps
    })

    res.status(201).json(workflow)

  } catch (error) {

    res.status(400).json({
      error: error.message
    })

  }

}

// List workflows
exports.getWorkflows = async (req, res) => {

  try {

    const workflows = await Workflow.find({
      ownerId: req.user.id
    }).sort({ createdAt: -1 })

    res.json(workflows)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}

// Get single workflow
exports.getWorkflowById = async (req, res) => {

  try {

    const workflow = await Workflow.findOne({
      _id: req.params.id,
      ownerId: req.user.id
    })

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found"
      })
    }

    res.json(workflow)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}