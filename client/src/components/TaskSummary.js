const TaskSummary = ({ tasks, categories }) => {
  if (tasks.length === 0) {
    return <p>No tasks found. Add a task to get started!</p>
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const categoryName = categories.find((cat) => cat.id === task.categoryId)?.name || "No Category"

        return (
          <div
            key={task.id}
            className={`task-summary-item priority-${task.priority} ${task.completed ? "completed" : ""}`}
          >
            <div className="task-summary-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-status-badge">
                {task.completed ? (
                  <span className="status-badge completed">Completed</span>
                ) : (
                  <span className="status-badge pending">Pending</span>
                )}
              </div>
            </div>

            <p className="task-description">{task.description}</p>

            <div className="task-meta">
              <span className="task-category">{categoryName}</span>
              <span className="task-category">Priority: {task.priority}</span>
              {task.assignee && <span className="task-category">Assignee: {task.assignee}</span>}
              {task.dueDate && (
                <span className="task-category">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              )}
              <span className="task-category">Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TaskSummary

