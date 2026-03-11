const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const { triggerWorkflow } = require("../controllers/runController")

const eventBus = require("../services/eventBus")

// Trigger workflow
router.post("/:id/trigger", auth, triggerWorkflow)

// SSE stream endpoint
router.get("/:id/stream", (req, res) => {

  const runId = req.params.id

  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")

  // IMPORTANT
  res.flushHeaders()

  // send initial message
  res.write(`data: ${JSON.stringify({ message: "stream connected" })}\n\n`)

  const listener = (event) => {

    if (event.runId.toString() === runId) {

      console.log("SSE sending:", event)

      res.write(`data: ${JSON.stringify(event)}\n\n`)

    }

  }

  eventBus.on("stepUpdate", listener)

  req.on("close", () => {

    eventBus.removeListener("stepUpdate", listener)

  })

})

module.exports = router