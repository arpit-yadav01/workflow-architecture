function withTimeout(promise, ms) {

  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Step timeout exceeded")), ms)
  })

  return Promise.race([promise, timeout])
}

module.exports = withTimeout