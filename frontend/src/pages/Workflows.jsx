import { useEffect, useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"

export default function Workflows() {

  const [workflows, setWorkflows] = useState([])
  const navigate = useNavigate()

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

      navigate(`/runs/${res.data._id}`)

    } catch (err) {

      console.error(err)

    }

  }


  return (

    <div className="p-4">

      <h2 className="text-xl mb-4">Workflows</h2>

      <button
        onClick={() => navigate("/builder")}
        className="bg-blue-500 text-white p-2 mb-4"
      >
        New Workflow
      </button>


      {workflows.map(w => (

        <div
          key={w._id}
          className="border p-2 mb-2 cursor-pointer"
          onClick={() => navigate(`/builder/${w._id}`)}
        >

          {w.name}

          <button
            onClick={(e) => {
              e.stopPropagation()
              triggerRun(w._id)
            }}
            className="bg-green-500 text-white p-1 ml-2"
          >
            Run
          </button>

        </div>

      ))}

    </div>

  )

}