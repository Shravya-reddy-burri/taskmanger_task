"use client"

import { useState, useEffect } from "react"

const TaskItem = ({ task, deleteTask, toggleComplete, editTask, categories }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    categoryId: task.categoryId,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    assignee: task.assignee || "",
  })
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    categoryId: "",
    dueDate: "",
    assignee: "",
  })
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    categoryId: false,
    dueDate: false,
    assignee: false,
  })

  const { title, description, categoryId, priority, dueDate, assignee } = editedTask

  useEffect(() => {
    if (isEditing) {
      validateForm()
    }
  }, [editedTask, isEditing])

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      categoryId: "",
      dueDate: "",
      assignee: "",
    }

    if (!title.trim()) {
      newErrors.title = "Title is required"
    } else if (title.length > 100) {
      newErrors.title = "Title must be less than 100 characters"
    }

    if (description && description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    if (!categoryId) {
      newErrors.categoryId = "Please select a category"
    }

    if (dueDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selectedDate = new Date(dueDate)

      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past"
      }
    }

    if (assignee && assignee.length > 50) {
      newErrors.assignee = "Assignee name must be less than 50 characters"
    }

    setErrors(newErrors)
  }

  const onChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value })

    setTouched({
      ...touched,
      [e.target.name]: true,
    })
  }

  const handleBlur = (e) => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    validateForm()

    const hasErrors = Object.values(errors).some((error) => error !== "")
    if (hasErrors) {
      return
    }

    editTask(task.id, editedTask)
    setIsEditing(false)

    setTouched({
      title: false,
      description: false,
      categoryId: false,
      dueDate: false,
      assignee: false,
    })
  }

  const handleCancel = () => {
    setEditedTask({
      title: task.title,
      description: task.description,
      categoryId: task.categoryId,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      assignee: task.assignee || "",
    })
    setIsEditing(false)

    setTouched({
      title: false,
      description: false,
      categoryId: false,
      dueDate: false,
      assignee: false,
    })

    setErrors({
      title: "",
      description: "",
      categoryId: "",
      dueDate: "",
      assignee: "",
    })
  }

  const categoryName = categories.find((cat) => cat.id === task.categoryId)?.name || "No Category"

  return (
    <div className={`task-item priority-${task.priority} ${task.completed ? "completed" : ""}`}>
      {isEditing ? (
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
          <div className="form-group">
            <label>
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              className={`form-control ${touched.title && errors.title ? "is-invalid" : ""}`}
              value={title}
              onChange={onChange}
              onBlur={handleBlur}
            />
            {touched.title && errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className={`form-control ${touched.description && errors.description ? "is-invalid" : ""}`}
              value={description}
              onChange={onChange}
              onBlur={handleBlur}
            ></textarea>
            {touched.description && errors.description && <div className="error-message">{errors.description}</div>}
            <small className="form-text text-muted">{description.length}/500 characters</small>
          </div>

          <div className="form-group">
            <label>
              Category <span className="required">*</span>
            </label>
            <select
              name="categoryId"
              className={`form-control ${touched.categoryId && errors.categoryId ? "is-invalid" : ""}`}
              value={categoryId}
              onChange={onChange}
              onBlur={handleBlur}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {touched.categoryId && errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" className="form-control" value={priority} onChange={onChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              className={`form-control ${touched.dueDate && errors.dueDate ? "is-invalid" : ""}`}
              value={dueDate}
              onChange={onChange}
              onBlur={handleBlur}
            />
            {touched.dueDate && errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
          </div>

          <div className="form-group">
            <label>Assign To User</label>
            <input
              type="text"
              name="assignee"
              className={`form-control ${touched.assignee && errors.assignee ? "is-invalid" : ""}`}
              value={assignee}
              onChange={onChange}
              onBlur={handleBlur}
            />
            {touched.assignee && errors.assignee && <div className="error-message">{errors.assignee}</div>}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div>
            <h3 className="task-title">{task.title}</h3>
            <p>{task.description}</p>
            <div>
              <span className="task-category">{categoryName}</span>
              <span className="task-category">Priority: {task.priority}</span>
              {task.dueDate && (
                <span className="task-category">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              )}
              {task.assignee && <span className="task-category">Assignee: {task.assignee}</span>}
            </div>
          </div>
          <div className="task-actions">
            <button
              className={`btn ${task.completed ? "btn-warning" : "btn-success"}`}
              onClick={() => toggleComplete(task.id)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TaskItem

