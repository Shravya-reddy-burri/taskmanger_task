"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import AllTasks from "./pages/AllTasks"
import PendingTasks from "./pages/PendingTasks"
import CompletedTasks from "./pages/CompletedTasks"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Layout from "./components/Layout"
import "./App.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      fetchUserData(token)
    }
  }, [])

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: "GET",
        headers: { token },
      })

      const parseRes = await response.json()

      if (parseRes.user) {
        setUser(parseRes.user)
      }
    } catch (err) {
      console.error(err.message)
    }
  }

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean)
    if (!boolean) {
      setUser(null)
    }
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login setAuth={setAuth} setUser={setUser} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register setAuth={setAuth} setUser={setUser} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Layout>
                  <Dashboard setAuth={setAuth} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/all-tasks"
            element={
              isAuthenticated ? (
                <Layout>
                  <AllTasks />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/pending-tasks"
            element={
              isAuthenticated ? (
                <Layout>
                  <PendingTasks />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/completed-tasks"
            element={
              isAuthenticated ? (
                <Layout>
                  <CompletedTasks />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
