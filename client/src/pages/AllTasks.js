"use client"

import { useState, useEffect } from "react"
import TaskSummary from "../components/TaskSummary"

const AllTasks = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        headers: { token: localStorage.getItem("token") },
      })

      const parseRes = await response.json()

      if (parseRes.tasks) {
        setTasks(parseRes.tasks)
      }
    } catch (err) {
      console.error(err.message)
      setMessage({ type: "danger", text: "Error fetching tasks" })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "GET",
        headers: { token: localStorage.getItem("token") },
      })

      const parseRes = await response.json()

      if (parseRes.categories) {
        setCategories(parseRes.categories)
      }
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchCategories()
  }, [])

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed" && !task.completed) return false
    if (filter === "pending" && task.completed) return false

    if (filter !== "all" && filter !== "completed" && filter !== "pending") {
      if (task.categoryId !== Number.parseInt(filter)) return false
    }

    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    return true
  })

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>All Tasks</h2>
      </div>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filters">
        <div className={`filter-item ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All
        </div>
        <div className={`filter-item ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
          Pending
        </div>
        <div className={`filter-item ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>
          Completed
        </div>
        {categories.map((category) => (
          <div
            key={category.id}
            className={`filter-item ${filter === category.id.toString() ? "active" : ""}`}
            onClick={() => setFilter(category.id.toString())}
          >
            {category.name}
          </div>
        ))}
      </div>

      {loading ? <p>Loading tasks...</p> : <TaskSummary tasks={filteredTasks} categories={categories} />}
    </div>
  )
}

export default AllTasks

