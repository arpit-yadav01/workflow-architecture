const mongoose = require("mongoose")

const stepDefinitionSchema = new mongoose.Schema({
  stepId: {
    type: String,
    required: true
  },

  name: String,

  type: {
    type: String,
    enum: ["http", "transform", "condition", "delay"],
    required: true
  },

  config: {
    url: String,
    method: String,
    body: mongoose.Schema.Types.Mixed,

    transformFn: String,
    conditionExpr: String,
    delayMs: Number
  },

  dependsOn: [String],

  retries: {
    maxAttempts: { type: Number, default: 1 },
    backoffMs: { type: Number, default: 1000 }
  },

  timeoutMs: {
    type: Number,
    default: 10000
  },

  onFailure: {
    type: String,
    enum: ["stop", "continue", "skip"],
    default: "stop"
  }
})

const workflowSchema = new mongoose.Schema({

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: String,

  description: String,

  steps: [stepDefinitionSchema],

  version: {
    type: Number,
    default: 1
  }

}, { timestamps: true })

module.exports = mongoose.model("Workflow", workflowSchema)