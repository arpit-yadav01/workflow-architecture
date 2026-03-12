import { BrowserRouter, Routes, Route } from "react-router-dom"

import Builder from "./pages/Builder"
import Workflows from "./pages/Workflows"
import Runs from "./pages/Runs"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Workflows />} />

        <Route path="/builder" element={<Builder />} />

        <Route path="/runs" element={<Runs />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App