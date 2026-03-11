const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const { triggerWorkflow } = require("../controllers/runController")

router.post("/:id/trigger", auth, triggerWorkflow)

module.exports = router