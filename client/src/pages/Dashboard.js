"use client";

import { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import {
  FaTasks,
  FaClipboardCheck,
  FaClipboardList,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

const Dashboard = ({ setAuth }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const DEFAULT_CATEGORIES = ["IT", "Sales", "Marketing", "Operations", "HR"];

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: "GET",
        headers: { token },
      });

      const parseRes = await response.json();

      if (parseRes.user) {
        setUser(parseRes.user);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchDueTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        headers: { token },
      });

      const parseRes = await response.json();

      if (parseRes.tasks) {
        const today = new Date().toISOString().split("T")[0];
        const dueTasks = parseRes.tasks.filter((task) => {
          if (!task.dueDate || task.completed) return false;
          const dueDate = new Date(task.dueDate).toISOString().split("T")[0];
          return dueDate === today;
        });

        setNotifications(dueTasks);
        setUnreadCount(dueTasks.length);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        headers: { token: localStorage.getItem("token") },
      });

      const parseRes = await response.json();

      if (parseRes.tasks) {
        setTasks(parseRes.tasks);

        const total = parseRes.tasks.length;
        const completed = parseRes.tasks.filter(
          (task) => task.completed
        ).length;
        const pending = total - completed;

        setStats({
          total,
          completed,
          pending,
        });
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "GET",
        headers: { token: localStorage.getItem("token") },
      });

      const parseRes = await response.json();

      if (parseRes.categories) {
        setCategories(parseRes.categories);

        const existingCategoryNames = parseRes.categories.map(
          (cat) => cat.name
        );
        const missingCategories = DEFAULT_CATEGORIES.filter(
          (cat) => !existingCategoryNames.includes(cat)
        );

        if (missingCategories.length > 0) {
          missingCategories.forEach((categoryName) => {
            addCategory(categoryName);
          });
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchUserData();
    fetchDueTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(task),
      });

      const parseRes = await response.json();

      if (parseRes.task) {
        setTasks([...tasks, parseRes.task]);
        setStats({
          ...stats,
          total: stats.total + 1,
          pending: stats.pending + 1,
        });
        setMessage({ type: "success", text: "Task added successfully!" });

        fetchTasks();
        fetchDueTasks();
      } else {
        setMessage({
          type: "danger",
          text: parseRes.message || "Failed to add task",
        });
      }
    } catch (err) {
      console.error(err.message);
      setMessage({ type: "danger", text: "Server error" });
    }
  };

  const addCategory = async (categoryName) => {
    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ name: categoryName }),
      });

      const parseRes = await response.json();

      if (parseRes.category) {
        setCategories((prevCategories) => [
          ...prevCategories,
          parseRes.category,
        ]);
        return parseRes.category;
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getUserInitials = () => {
    if (!user || !user.name) return "U";

    const nameParts = user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <div className="header-controls">
          <div className="notifications-wrapper">
            <button
              className="notifications-trigger"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              aria-label="Notifications"
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      className="mark-read-btn"
                      onClick={() => setUnreadCount(0)}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notifications-content">
                  {notifications.length === 0 ? (
                    <p className="no-notifications">No tasks due today</p>
                  ) : (
                    <>
                      <h4 className="notifications-subheader">
                        Tasks Due Today
                      </h4>
                      <ul className="notifications-list">
                        {notifications.map((task) => (
                          <li key={task.id} className="notification-item">
                            <div className="notification-content">
                              <span className="notification-title">
                                {task.title}
                              </span>
                              <span className="notification-meta">
                                {task.assignee
                                  ? `Assigned to: ${task.assignee}`
                                  : "Unassigned"}
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

          <div className="user-profile-wrapper">
            <button
              className="user-profile-trigger"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              aria-label="User profile"
            >
              <div className="user-avatar">{getUserInitials()}</div>
            </button>

            {showUserMenu && (
              <div className="user-profile-dropdown">
                <div className="user-profile-content">
                  <div className="user-info-container">
                    <div className="user-avatar-large">{getUserInitials()}</div>
                    <div className="user-details">
                      <h4 className="user-name">{user?.name || "User"}</h4>
                      <p className="user-email">{user?.email || "No email"}</p>
                    </div>
                  </div>

                  <div className="user-profile-menu">
                    <button
                      className="user-profile-menu-item logout-btn"
                      onClick={logout}
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`alert alert-${message.type}`}
          style={{ padding: "8px", marginBottom: "10px" }}
        >
          {message.text}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaTasks />
          </div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed-icon">
            <FaClipboardCheck />
          </div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Add New Task</h2>
          <TaskForm addTask={addTask} categories={categories} />
        </div>

        <div className="dashboard-section">
          <h2>Recent Tasks</h2>
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <div className="recent-tasks">
              {recentTasks.length === 0 ? (
                <p>No tasks yet. Add your first task!</p>
              ) : (
                <ul className="recent-task-list">
                  {recentTasks.map((task) => (
                    <li
                      key={task.id}
                      className={`recent-task-item ${
                        task.completed ? "completed" : ""
                      }`}
                    >
                      <div className="recent-task-title">
                        <span
                          className={`priority-indicator priority-${task.priority}`}
                        ></span>
                        {task.title}
                      </div>
                      <div className="recent-task-meta">
                        {task.assignee && (
                          <span className="recent-task-assignee">
                            Assignee: {task.assignee}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="recent-task-due-date">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span
                          className={`recent-task-status ${
                            task.completed
                              ? "completed-status"
                              : "pending-status"
                          }`}
                        >
                          {task.completed ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
