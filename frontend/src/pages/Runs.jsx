import { useEffect, useState } from "react"
import api from "../api/axios"
import useRunStream from "../hooks/useRunStream"

export default function Runs() {

  const [runs, setRuns] = useState([])
  const [currentRun, setCurrentRun] = useState(null)

  const loadRuns = async () => {

    try {

      const res = await api.get("/runs")

      setRuns(res.data)

    } catch (err) {

      console.error(err)

    }

  }

  useEffect(() => {
    loadRuns()
  }, [])


  useRunStream(currentRun, (event) => {

    console.log("SSE", event)

  })


  return (

    <div className="p-4">

      <h2 className="text-xl mb-4">Runs</h2>

      {runs.map(r => (

        <div
          key={r._id}
          className="border p-2 mb-2"
          onClick={() => setCurrentRun(r._id)}
        >

          {r.status}

        </div>

      ))}

    </div>

  )

}