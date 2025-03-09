const sequelize = require("../config/db")
const User = require("./User")
const Task = require("./Task")
const Category = require("./Category")

User.hasMany(Task, { foreignKey: "userId" })
Task.belongsTo(User, { foreignKey: "userId" })

User.hasMany(Category, { foreignKey: "userId" })
Category.belongsTo(User, { foreignKey: "userId" })

Category.hasMany(Task, { foreignKey: "categoryId" })
Task.belongsTo(Category, { foreignKey: "categoryId" })

module.exports = {
  sequelize,
  User,
  Task,
  Category,
}

