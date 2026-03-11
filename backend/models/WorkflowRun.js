const mongoose = require("mongoose")

const workflowRunSchema = new mongoose.Schema({

  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workflow"
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["queued", "running", "success", "failed", "cancelled"],
    default: "queued"
  },

  input: mongoose.Schema.Types.Mixed,

  startedAt: Date,

  finishedAt: Date,

  triggeredBy: {
    type: String,
    enum: ["manual", "api"],
    default: "manual"
  }

}, { timestamps: true })

module.exports = mongoose.model("WorkflowRun", workflowRunSchema)