const express = require("express")
const router = express.Router()
const taskController = require("../controllers/taskController")
const auth = require("../middleware/auth")

router.use(auth)


router.get("/", taskController.getAllTasks)


router.get("/search", taskController.searchTasks)


router.get("/category/:categoryId", taskController.getTasksByCategory)


router.get("/status/:status", taskController.getTasksByStatus)


router.get("/:id", taskController.getTaskById)


router.post("/", taskController.createTask)


router.put("/:id", taskController.updateTask)


router.delete("/:id", taskController.deleteTask)

module.exports = router

