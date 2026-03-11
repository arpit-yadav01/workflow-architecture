const { runWorkflow } = require("../engine/workflowRunner")

exports.triggerWorkflow = async (req, res) => {

  try {

    const workflowId = req.params.id
    const input = req.body || {}

    const run = await runWorkflow(workflowId, input)

    res.json(run)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}