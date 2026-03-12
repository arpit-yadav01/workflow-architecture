import { useEffect } from "react"

export default function useRunStream(runId, onEvent) {

  useEffect(() => {

    if (!runId) return

    const es = new EventSource(
      `http://localhost:5000/api/runs/${runId}/stream`,
      { withCredentials: true }
    )

    es.onmessage = (e) => {

      const data = JSON.parse(e.data)

      onEvent(data)

    }

    return () => es.close()

  }, [runId])

}