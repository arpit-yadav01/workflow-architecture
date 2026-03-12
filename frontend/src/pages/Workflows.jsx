import { useEffect, useState } from "react"
import api from "../api/axios"

export default function Workflows() {

  const [workflows, setWorkflows] = useState([])

  const loadWorkflows = async () => {

    try {

      const res = await api.get("/workflows")

      setWorkflows(res.data)

    } catch (err) {

      console.error(err)

    }

  }

  useEffect(() => {
    loadWorkflows()
  }, [])

  const triggerRun = async (id) => {

    try {

      const res = await api.post(`/runs/${id}/trigger`)

      console.log(res.data)

      alert("Run started")

    } catch (err) {

      console.error(err)

    }

  }

  return (

    <div className="p-4">

      <h2 className="text-xl mb-4">Workflows</h2>

      <a
        href="/builder"
        className="bg-blue-500 text-white p-2 inline-block mb-4"
      >
        New Workflow
      </a>

      {workflows.map(w => (

        <div
          key={w._id}
          className="border p-2 mb-2"
        >

          {w.name}

          <button
            onClick={() => triggerRun(w._id)}
            className="bg-green-500 text-white p-1 ml-2"
          >
            Run
          </button>

        </div>

      ))}

    </div>

  )

}