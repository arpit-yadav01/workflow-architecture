import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import RunMonitor from "./RunMonitor"
import { useEffect, useState } from "react"

export default function RunPage() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [run, setRun] = useState(null)


  useEffect(() => {

    loadRun()

  }, [])


  const loadRun = async () => {

    try {

      const res = await api.get(`/runs/${id}`)

      setRun(res.data.run)

    } catch (err) {

      console.log(err)

    }

  }


  const cancelRun = async () => {

    try {

      await api.post(`/runs/${id}/cancel`)

      alert("Run cancelled")

      navigate("/")

    } catch (err) {

      console.log(err)

    }

  }


  return (

    <div>

      <div style={{ padding: 10 }}>

        {run && (
          <p>Status: {run.status}</p>
        )}

        <button
          onClick={cancelRun}
          style={{
            background: "red",
            color: "white",
            padding: 5,
          }}
        >
          Cancel Run
        </button>

      </div>

      <RunMonitor runId={id} />

    </div>

  )

}