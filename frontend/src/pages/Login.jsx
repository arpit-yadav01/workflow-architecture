import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {

    try {

      const res = await api.post("/auth/login", {
        email,
        password
      })

      login(res.data.user)

      navigate("/")

    } catch (err) {

      alert("Login failed")

    }

  }

  return (

    <div className="p-4">

      <h2>Login</h2>

      <input
        placeholder="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border block mb-2"
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border block mb-2"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2"
      >
        Login
      </button>

    </div>

  )

}