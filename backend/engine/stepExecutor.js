const axios = require("axios")

async function executeStep(step, context) {

  const { type, config } = step

  if (type === "delay") {

    await new Promise(resolve =>
      setTimeout(resolve, config.delayMs || 1000)
    )

    return { delayed: true }
  }

  if (type === "http") {

    const response = await axios({
      method: config.method || "GET",
      url: config.url,
      data: config.body
    })

    return response.data
  }

  if (type === "transform") {

    const fn = new Function("context", config.transformFn)

    return fn(context)
  }

  if (type === "condition") {

    const fn = new Function("context", `return ${config.conditionExpr}`)

    return { condition: fn(context) }
  }

}

module.exports = {
  executeStep
}