"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Logo from "../components/Logo.js"

const Login = ({ setAuth, setUser }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  })
  const [message, setMessage] = useState({ type: "", text: "" })

  const { email, password } = inputs

  useEffect(() => {
    const successMessage = localStorage.getItem("registrationSuccess")
    if (successMessage) {
      setMessage({ type: "success", text: successMessage })
      localStorage.removeItem("registrationSuccess")
    }
  }, [])

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()

    try {
      const body = { email, password }
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const parseRes = await response.json()

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token)
        setAuth(true)

        const userResponse = await fetch("http://localhost:5000/api/auth/user", {
          method: "GET",
          headers: { token: parseRes.token },
        })

        const userRes = await userResponse.json()
        if (userRes.user) {
          setUser(userRes.user)
        }
      } else {
        setAuth(false)
        setMessage({ type: "danger", text: parseRes.message || "Invalid credentials" })
      }
    } catch (err) {
      console.error(err.message)
      setMessage({ type: "danger", text: "Server error" })
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <Logo />
        <h2>Login</h2>
      </div>
      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <form onSubmit={onSubmitForm}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }}>
          Login
        </button>
      </form>
      <div className="auth-footer">
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login

