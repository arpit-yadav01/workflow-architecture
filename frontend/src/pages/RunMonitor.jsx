import { useState } from "react"
import ReactFlow from "reactflow"
import api from "../api/axios"
import useRunStream from "../hooks/useRunStream"

export default function RunMonitor({ runId }) {

  const [nodes, setNodes] = useState([])
  const [stepData, setStepData] = useState(null)


  // SSE updates

  useRunStream(runId, (event) => {

    setNodes((n) =>
      n.map((node) => {

        if (node.id !== event.stepId) return node

        return {
          ...node,
          style: {
            background: getColor(event.status),
          },
        }

      })
    )

  })


  const getColor = (status) => {

    if (status === "running") return "blue"
    if (status === "success") return "green"
    if (status === "failed") return "red"
    if (status === "skipped") return "yellow"

    return "gray"
  }


  // click node → load step detail

  const openStep = async (node) => {

    try {

      const res = await api.get(
        `/runs/${runId}/steps/${node.id}`
      )

      setStepData(res.data)

    } catch (err) {

      console.log(err)

    }

  }


  return (

    <div style={{ height: "90vh", position: "relative" }}>

      <ReactFlow
        nodes={nodes}
        onNodeClick={(e, node) => openStep(node)}
      />



      {/* Drawer */}

      {stepData && (

        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 300,
            height: "100%",
            background: "white",
            borderLeft: "1px solid black",
            padding: 10,
            overflow: "auto",
          }}
        >

          <h3>Step Detail</h3>

          <p>Status: {stepData.status}</p>

          <p>Attempt: {stepData.attempt}</p>

          <p>Error: {stepData.error}</p>

          <h4>Output</h4>

          <pre>
            {JSON.stringify(stepData.output, null, 2)}
          </pre>

        </div>

      )}

    </div>

  )

}