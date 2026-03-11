const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  })
}

exports.register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await User.create({
      email,
      passwordHash,
      displayName
    })

    const token = generateToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
      message: "User registered",
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.logout = (req, res) => {
  res.clearCookie("token")
  res.json({ message: "Logged out" })
}