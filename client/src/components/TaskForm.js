"use client"

import { useState, useEffect } from "react"

const TaskForm = ({ addTask, categories }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "medium",
    dueDate: "",
    assignee: "",
  })
  const [formSuccess, setFormSuccess] = useState(false)
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

  const { title, description, categoryId, priority, dueDate, assignee } = task

  useEffect(() => {
    validateForm()
  }, [task])

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
    setTask({ ...task, [e.target.name]: e.target.value })

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

  const onSubmit = async (e) => {
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

    await addTask(task)

    setFormSuccess(true)
    setTimeout(() => setFormSuccess(false), 500)

    setTask({
      title: "",
      description: "",
      categoryId: "",
      priority: "medium",
      dueDate: "",
      assignee: "",
    })

    setTouched({
      title: false,
      description: false,
      categoryId: false,
      dueDate: false,
      assignee: false,
    })
  }

  return (
    <div className={`task-form ${formSuccess ? "form-success" : ""}`}>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="title">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`form-control ${touched.title && errors.title ? "is-invalid" : ""}`}
                value={title}
                onChange={onChange}
                onBlur={handleBlur}
                placeholder="What needs to be done?"
              />
              {touched.title && errors.title && <div className="error-message">{errors.title}</div>}
            </div>
          </div>
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className={`form-control ${touched.dueDate && errors.dueDate ? "is-invalid" : ""}`}
                value={dueDate}
                onChange={onChange}
                onBlur={handleBlur}
              />
              {touched.dueDate && errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className={`form-control ${touched.description && errors.description ? "is-invalid" : ""}`}
            value={description}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder="Add details about this task..."
          ></textarea>
          {touched.description && errors.description && <div className="error-message">{errors.description}</div>}
          <small className="form-text text-muted">{description.length}/500 characters</small>
        </div>

        <div className="form-row">
          <div className="form-col">
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
          </div>
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" className="form-control" value={priority} onChange={onChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="assignee">Assign To User</label>
              <input
                type="text"
                id="assignee"
                name="assignee"
                className={`form-control ${touched.assignee && errors.assignee ? "is-invalid" : ""}`}
                value={assignee}
                onChange={onChange}
                onBlur={handleBlur}
                placeholder="Enter username to assign this task"
              />
              {touched.assignee && errors.assignee && <div className="error-message">{errors.assignee}</div>}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-sm" style={{ width: "30%", marginTop: "3px" }}>
          Add Task
        </button>
      </form>
    </div>
  )
}

export default TaskForm

