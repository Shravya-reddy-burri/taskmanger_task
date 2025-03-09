"use client"

import { useState, useEffect } from "react"
import { FaBell } from "react-icons/fa"

const Notifications = ({ token }) => {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchDueTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        headers: { token },
      })

      const parseRes = await response.json()

      if (parseRes.tasks) {
        const today = new Date().toISOString().split("T")[0]
        const dueTasks = parseRes.tasks.filter((task) => {
          if (!task.dueDate || task.completed) return false
          const dueDate = new Date(task.dueDate).toISOString().split("T")[0]
          return dueDate === today
        })

        setNotifications(dueTasks)
        setUnreadCount(dueTasks.length)
      }
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    if (token) {
      fetchDueTasks()
    }
  }, [token])

  return (
    <div className="notifications-wrapper">
      <button className="notifications-trigger" onClick={() => setIsOpen(!isOpen)} aria-label="Notifications">
        <FaBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button className="mark-read-btn" onClick={() => setUnreadCount(0)}>
                Mark all as read
              </button>
            )}
          </div>
          <div className="notifications-content">
            {notifications.length === 0 ? (
              <p className="no-notifications">No tasks due today</p>
            ) : (
              <>
                <h4 className="notifications-subheader">Tasks Due Today</h4>
                <ul className="notifications-list">
                  {notifications.map((task) => (
                    <li key={task.id} className="notification-item">
                      <div className="notification-content">
                        <span className="notification-title">{task.title}</span>
                        <span className="notification-meta">
                          {task.assignee ? `Assigned to: ${task.assignee}` : "Unassigned"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications

