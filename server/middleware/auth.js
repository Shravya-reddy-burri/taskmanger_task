const jwt = require("jsonwebtoken")

const jwtSecret = "your_jwt_secret" 

module.exports = (req, res, next) => {
  const token = req.header("token")

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)

    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

