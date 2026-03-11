const mongoose = require("mongoose")

const stepRunSchema = new mongoose.Schema({

  runId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkflowRun"
  },

  stepId: String,

  status: {
    type: String,
    enum: ["waiting", "running", "success", "failed", "skipped"],
    default: "waiting"
  },

  attempt: {
    type: Number,
    default: 1
  },

  startedAt: Date,

  finishedAt: Date,

  input: mongoose.Schema.Types.Mixed,

  output: mongoose.Schema.Types.Mixed,

  error: String,

  logs: [String]

}, { timestamps: true })

module.exports = mongoose.model("StepRun", stepRunSchema)