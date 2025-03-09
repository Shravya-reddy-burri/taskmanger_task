const express = require("express")
const cors = require("cors")
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json()) 

app.use("/api/auth", require("./routes/auth"))
app.use("/api/tasks", require("./routes/tasks"))
app.use("/api/categories", require("./routes/categories"))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

