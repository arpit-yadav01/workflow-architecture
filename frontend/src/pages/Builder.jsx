import { useCallback, useState, useEffect } from "react"
import { useParams } from "react-router-dom"

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

  const { id: workflowId } = useParams()

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)


  // add node
  const addNode = () => {

    const newNode = {
      id: String(id++),
      position: { x: 200, y: 200 },
      data: { label: "Step", type: "delay" },
    }

    setNodes(n => [...n, newNode])

  }


  // connect
  const onConnect = useCallback(
    (params) => setEdges(e => addEdge(params, e)),
    []
  )


  const onNodeClick = (e, node) => {
    setSelectedNode(node)
  }


  // update type
  const updateNodeType = (type) => {

    setNodes(nodes.map(n =>
      n.id === selectedNode.id
        ? { ...n, data: { ...n.data, type } }
        : n
    ))

    setSelectedNode({
      ...selectedNode,
      data: { ...selectedNode.data, type }
    })

  }


  // build steps
  const buildSteps = () => {

    return nodes.map(node => {

      const deps = edges
        .filter(e => e.target === node.id)
        .map(e => e.source)

      return {
        stepId: node.id,
        type: node.data.type,
        dependsOn: deps,
        config: {}
      }

    })

  }


  const saveWorkflow = async () => {

    const steps = buildSteps()

    await api.post("/workflows", {
      name: "My Workflow",
      steps
    })

    alert("Saved")

  }


  // LOAD WORKFLOW

  useEffect(() => {

    if (!workflowId) return

    loadWorkflow()

  }, [workflowId])


  const loadWorkflow = async () => {

    const res = await api.get(`/workflows/${workflowId}`)

    convertToFlow(res.data.steps)

  }


  const convertToFlow = (steps) => {

    const newNodes = []
    const newEdges = []

    steps.forEach((s, i) => {

      newNodes.push({
        id: s.stepId,
        position: { x: 100 + i * 150, y: 100 },
        data: {
          label: "step",
          type: s.type || "delay"
        }
      })

      s.dependsOn?.forEach(dep => {

        newEdges.push({
          id: dep + "-" + s.stepId,
          source: dep,
          target: s.stepId
        })

      })

    })

    setNodes(newNodes)
    setEdges(newEdges)

  }


  return (

    <div className="w-screen h-screen bg-gray-100 relative">

      <button onClick={addNode}>Add Step</button>
      <button onClick={saveWorkflow}>Save</button>

      <div style={{ height: "90vh" }}>

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


      {selectedNode && (

        <div className="absolute right-0 top-0 w-60 bg-white p-2">

          <h3>Config</h3>

          <select
            value={selectedNode.data.type}
            onChange={(e) => updateNodeType(e.target.value)}
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