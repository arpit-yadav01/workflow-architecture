import { useParams } from "react-router-dom"
import RunMonitor from "./RunMonitor"

export default function RunPage() {

  const { id } = useParams()

  return <RunMonitor runId={id} />

}