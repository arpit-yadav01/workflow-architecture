const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")

const {
  createWorkflow,
  getWorkflows,
  getWorkflowById
} = require("../controllers/workflowController")

router.post("/", auth, createWorkflow)

router.get("/", auth, getWorkflows)

router.get("/:id", auth, getWorkflowById)

module.exports = router