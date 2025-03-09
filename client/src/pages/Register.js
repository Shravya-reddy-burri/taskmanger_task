"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Logo from "../components/Logo.js"

const Register = ({ setAuth, setUser }) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [message, setMessage] = useState({ type: "", text: "" })
  const navigate = useNavigate()

  const { name, email, password } = inputs

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()

    try {
      const body = { name, email, password }
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const parseRes = await response.json()

      if (parseRes.token) {
        localStorage.setItem("registrationSuccess", "Registration successful! Please login.")

        setInputs({
          name: "",
          email: "",
          password: "",
        })

        navigate("/login")
      } else {
        setAuth(false)
        setMessage({ type: "danger", text: parseRes.message || "Registration failed" })
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
        <h2>Register</h2>
      </div>
      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <form onSubmit={onSubmitForm}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" className="form-control" value={name} onChange={onChange} required />
        </div>
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
          Register
        </button>
      </form>
      <div className="auth-footer">
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register

