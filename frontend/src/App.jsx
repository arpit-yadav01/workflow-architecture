import { BrowserRouter, Routes, Route } from "react-router-dom"

import Builder from "./pages/Builder"
import Workflows from "./pages/Workflows"
import Runs from "./pages/Runs"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Protected from "./components/Protected"
import RunPage from "./pages/RunPage"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Protected><Workflows /></Protected>} />

        <Route path="/builder" element={<Protected><Builder /></Protected>} />

        <Route path="/builder/:id" element={<Protected><Builder /></Protected>} />

        <Route path="/runs" element={<Protected><Runs /></Protected>} />

        <Route path="/runs/:id" element={<Protected><RunPage /></Protected>} />

      </Routes>

    </BrowserRouter>

  )

}

export default App