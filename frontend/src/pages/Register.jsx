import { useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"

export default function Register() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")

  const navigate = useNavigate()

  const register = async () => {

    try {

      await api.post("/auth/register", {
        email,
        password,
        displayName
      })

      alert("Registered")

      navigate("/login")

    } catch (err) {

      alert("Register error")

    }

  }

  return (

    <div className="p-4">

      <h2>Register</h2>

      <input
        placeholder="name"
        onChange={e => setDisplayName(e.target.value)}
        className="border block mb-2"
      />

      <input
        placeholder="email"
        onChange={e => setEmail(e.target.value)}
        className="border block mb-2"
      />

      <input
        type="password"
        placeholder="password"
        onChange={e => setPassword(e.target.value)}
        className="border block mb-2"
      />

      <button
        onClick={register}
        className="bg-blue-500 text-white p-2"
      >
        Register
      </button>

      <div>
        <a href="/login">Login</a>
      </div>

    </div>

  )

}