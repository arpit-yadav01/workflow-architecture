import { useCallback, useState } from "react"
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
} from "reactflow"

import "reactflow/dist/style.css"

import api from "../api/axios"

let id = 1

export default function Builder() {

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])


  // ✅ add node
  const addNode = () => {

    const newNode = {
      id: String(id++),
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: { label: "Step" },
    }

    setNodes((nds) => [...nds, newNode])
  }


  // ✅ connect nodes
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds))
    },
    []
  )


  // ✅ build steps
  const buildSteps = () => {

    const steps = nodes.map((node) => {

      const deps = edges
        .filter(e => e.target === node.id)
        .map(e => e.source)

      return {
        stepId: node.id,
        name: "step",
        type: "delay",
        dependsOn: deps,
        config: { delayMs: 1000 }
      }

    })

    return steps
  }


  // ✅ save workflow
  const saveWorkflow = async () => {

    try {

      const steps = buildSteps()

      const res = await api.post("/workflows", {
        name: "My Workflow",
        description: "Created from UI",
        steps
      })

      console.log("Saved", res.data)

      alert("Workflow saved")

    } catch (err) {

      console.error(err)
      alert("Error saving workflow")

    }

  }


  return (

    <div className="w-screen h-screen bg-gray-100">

      <div className="flex gap-2 p-2">

        <button
          onClick={addNode}
          className="px-3 py-2 bg-blue-500 text-white"
        >
          Add Step
        </button>

        <button
          onClick={saveWorkflow}
          className="px-3 py-2 bg-purple-600 text-white"
        >
          Save Workflow
        </button>

      </div>


      <div className="w-full h-[90vh]">

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
        >

          <Background />
          <Controls />
          <MiniMap />

        </ReactFlow>

      </div>

    </div>

  )

}