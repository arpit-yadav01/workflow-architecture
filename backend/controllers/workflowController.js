const Workflow = require("../models/Workflow")
const { validateAndSortDAG } = require("../engine/dagEngine")

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