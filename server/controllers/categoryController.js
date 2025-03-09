const { Category } = require("../models")

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [["name", "ASC"]],
    })

    res.json({ categories })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    })

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({ category })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      where: {
        name,
        userId: req.user.id,
      },
    })

    if (existingCategory) {
      return res.json({ category: existingCategory })
    }

    const category = await Category.create({
      name,
      userId: req.user.id,
    })

    res.json({ category })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body

    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    })

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    await category.update({ name })

    res.json({ category })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    })

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    await category.destroy()

    res.json({ success: true })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

