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
  const [selectedNode, setSelectedNode] = useState(null)


  // Add step node
  const addNode = () => {

    const newNode = {
      id: String(id++),

      position: { x: 200, y: 200 },

      data: {
        label: "Step",
        type: "delay",
      },

    }

    setNodes((nds) => [...nds, newNode])
  }


  // Connect nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  )


  // Select node
  const onNodeClick = (event, node) => {
    setSelectedNode(node)
  }


  // Update node type
  const updateNodeType = (type) => {

    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...n.data, type } }
          : n
      )
    )

    setSelectedNode((prev) => ({
      ...prev,
      data: { ...prev.data, type },
    }))

  }


  // Convert nodes → workflow steps
  const buildSteps = () => {

    const steps = nodes.map((node) => {

      const deps = edges
        .filter((e) => e.target === node.id)
        .map((e) => e.source)

      return {
        stepId: node.id,
        type: node.data.type,
        dependsOn: deps,
        config: {},
      }

    })

    return steps
  }


  // Save workflow
  const saveWorkflow = async () => {

    try {

      const steps = buildSteps()

      const res = await api.post("/workflows", {
        name: "My Workflow",
        steps,
      })

      console.log("Saved:", res.data)

      alert("Workflow saved")

    } catch (err) {

      console.error(err)
      alert("Error saving workflow")

    }

  }


  return (

    <div className="w-screen h-screen bg-gray-100 relative">

      <div className="p-2 flex gap-2">

        <button
          onClick={addNode}
          className="bg-blue-500 text-white px-3 py-2"
        >
          Add Step
        </button>

        <button
          onClick={saveWorkflow}
          className="bg-purple-600 text-white px-3 py-2"
        >
          Save Workflow
        </button>

      </div>


      <div className="w-full h-[90vh]">

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
        >

          <Background />
          <Controls />
          <MiniMap />

        </ReactFlow>

      </div>


      {/* CONFIG PANEL */}

      {selectedNode && (

        <div className="absolute right-0 top-0 w-64 bg-white border p-4 shadow">

          <h3 className="font-bold mb-3">Step Config</h3>

          <label className="block mb-2">Step Type</label>

          <select
            value={selectedNode.data.type}
            onChange={(e) => updateNodeType(e.target.value)}
            className="border p-2 w-full"
          >

            <option value="delay">delay</option>
            <option value="http">http</option>
            <option value="transform">transform</option>
            <option value="condition">condition</option>

          </select>

        </div>

      )}

    </div>

  )

}