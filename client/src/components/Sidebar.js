import { Link, useLocation } from "react-router-dom"
import Logo from "./Logo.js"

const Sidebar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? "active-nav-link" : ""
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Logo />
      </div>
      <div className="sidebar-menu">
        <ul>
          <li className={isActive("/dashboard")}>
            <Link to="/dashboard">
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={isActive("/all-tasks")}>
            <Link to="/all-tasks">
              <span>All Tasks</span>
            </Link>
          </li>
          <li className={isActive("/pending-tasks")}>
            <Link to="/pending-tasks">
              <span>Pending Tasks</span>
            </Link>
          </li>
          <li className={isActive("/completed-tasks")}>
            <Link to="/completed-tasks">
              <span>Completed Tasks</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar

