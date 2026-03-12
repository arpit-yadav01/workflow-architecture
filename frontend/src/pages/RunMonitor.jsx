import { useState } from "react"
import ReactFlow from "reactflow"
import useRunStream from "../hooks/useRunStream"

export default function RunMonitor({ runId }) {

  const [nodes, setNodes] = useState([])

  useRunStream(runId, (event) => {

    updateNode(event)

  })


  const updateNode = (event) => {

    setNodes(n =>
      n.map(node => {

        if (node.id !== event.stepId) return node

        return {
          ...node,
          style: {
            background: getColor(event.status)
          }
        }

      })
    )

  }


  const getColor = (status) => {

    if (status === "running") return "blue"
    if (status === "success") return "green"
    if (status === "failed") return "red"
    if (status === "skipped") return "yellow"

    return "gray"

  }


  return (

    <div style={{ height: "90vh" }}>

      <ReactFlow nodes={nodes} />

    </div>

  )

}