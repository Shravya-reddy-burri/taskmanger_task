import TaskItem from "./TaskItem"

const TaskList = ({ tasks, deleteTask, toggleComplete, editTask, categories }) => {
  if (tasks.length === 0) {
    return <p>No tasks found. Add a task to get started!</p>
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          editTask={editTask}
          categories={categories}
        />
      ))}
    </div>
  )
}

export default TaskList

