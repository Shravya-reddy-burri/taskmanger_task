"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa"

const UserProfile = ({ user, setAuth }) => {
  const [isOpen, setIsOpen] = useState(false)

  const logout = (e) => {
    e.preventDefault()
    localStorage.removeItem("token")
    setAuth(false)
  }

  const getUserInitials = () => {
    if (!user || !user.name) return "U"

    const nameParts = user.name.split(" ")
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <div className="user-profile-wrapper">
      <button className="user-profile-trigger" onClick={() => setIsOpen(!isOpen)} aria-label="User profile">
        <div className="user-avatar">{getUserInitials()}</div>
      </button>

      {isOpen && (
        <div className="user-profile-dropdown">
          <div className="user-profile-header">
            <h3>Account</h3>
          </div>
          <div className="user-profile-content">
            <div className="user-info-container">
              <div className="user-avatar-large">{getUserInitials()}</div>
              <div className="user-details">
                <h4 className="user-name">{user?.name || "User"}</h4>
                <p className="user-email">{user?.email || "No email"}</p>
              </div>
            </div>

            <div className="user-profile-menu">
              <Link to="/profile" className="user-profile-menu-item" onClick={() => setIsOpen(false)}>
                <FaUserCircle />
                <span>Profile</span>
              </Link>
              <Link to="/settings" className="user-profile-menu-item" onClick={() => setIsOpen(false)}>
                <FaCog />
                <span>Manage account</span>
              </Link>
              <button className="user-profile-menu-item logout-btn" onClick={logout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile

