module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("Tasks")
    if (!tableInfo.assignee) {
      await queryInterface.addColumn("Tasks", "assignee", {
        type: Sequelize.STRING,
        allowNull: true,
      })
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Tasks", "assignee")
  },
}

