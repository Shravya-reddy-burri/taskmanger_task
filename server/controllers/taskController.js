const { Task, Category } = require("../models")
const { Op } = require("sequelize")

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: [{ model: Category }],
      order: [["createdAt", "DESC"]],
    })

    res.json({ tasks })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: [{ model: Category }],
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json({ task })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.createTask = async (req, res) => {
  try {
    const { title, description, categoryId, priority, dueDate, assignee } = req.body

    const task = await Task.create({
      title,
      description,
      categoryId: categoryId || null,
      priority: priority || "medium",
      dueDate: dueDate || null,
      assignee: assignee || null,
      userId: req.user.id,
    })

    // Fetch the task with its category
    const newTask = await Task.findByPk(task.id, {
      include: [{ model: Category }],
    })

    res.json({ task: newTask })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.updateTask = async (req, res) => {
  try {
    const { title, description, categoryId, priority, dueDate, completed, assignee } = req.body

    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Update task
    await task.update({
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      categoryId: categoryId !== undefined ? categoryId : task.categoryId,
      priority: priority !== undefined ? priority : task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      completed: completed !== undefined ? completed : task.completed,
      assignee: assignee !== undefined ? assignee : task.assignee,
    })

    // Fetch the updated task with its category
    const updatedTask = await Task.findByPk(task.id, {
      include: [{ model: Category }],
    })

    res.json({ task: updatedTask })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    await task.destroy()

    res.json({ success: true })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.searchTasks = async (req, res) => {
  try {
    const { query } = req.query

    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
        title: {
          [Op.like]: `%${query}%`,
        },
      },
      include: [{ model: Category }],
      order: [["createdAt", "DESC"]],
    })

    res.json({ tasks })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.getTasksByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params

    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
        categoryId,
      },
      include: [{ model: Category }],
      order: [["createdAt", "DESC"]],
    })

    res.json({ tasks })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params
    const completed = status === "completed"

    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
        completed,
      },
      include: [{ model: Category }],
      order: [["createdAt", "DESC"]],
    })

    res.json({ tasks })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

