"use client"

import { useState, useEffect } from "react"
import TaskList from "../components/TaskList"

const PendingTasks = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks/status/pending", {
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

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { token: localStorage.getItem("token") },
      })

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id))
        setMessage({ type: "success", text: "Task deleted successfully" })
      } else {
        setMessage({ type: "danger", text: "Failed to delete task" })
      }
    } catch (err) {
      console.error(err.message)
      setMessage({ type: "danger", text: "Server error" })
    }
  }

  const toggleComplete = async (id) => {
    try {
      const taskToToggle = tasks.find((task) => task.id === id)
      if (!taskToToggle) return

      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ completed: !taskToToggle.completed }),
      })

      const parseRes = await response.json()

      if (parseRes.task) {
        fetchTasks()
        setMessage({ type: "success", text: "Task status updated" })
      } else {
        setMessage({ type: "danger", text: "Failed to update task status" })
      }
    } catch (err) {
      console.error(err.message)
      setMessage({ type: "danger", text: "Server error" })
    }
  }

  const editTask = async (id, updatedTask) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(updatedTask),
      })

      const parseRes = await response.json()

      if (parseRes.task) {
        setTasks(tasks.map((task) => (task.id === id ? parseRes.task : task)))
        setMessage({ type: "success", text: "Task updated successfully" })
      } else {
        setMessage({ type: "danger", text: "Failed to update task" })
      }
    } catch (err) {
      console.error(err.message)
      setMessage({ type: "danger", text: "Server error" })
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Pending Tasks</h2>
      </div>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search pending tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <h3>No pending tasks</h3>
              <p>All caught up! You have no pending tasks.</p>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              editTask={editTask}
              categories={categories}
            />
          )}
        </>
      )}
    </div>
  )
}

export default PendingTasks

