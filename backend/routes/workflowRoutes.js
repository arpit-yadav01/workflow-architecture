const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const { createWorkflow } = require("../controllers/workflowController")

router.post("/", auth, createWorkflow)

module.exports = router