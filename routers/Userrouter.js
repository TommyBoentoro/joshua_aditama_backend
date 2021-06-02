const express = require("express")
const Router = express.Router()

// Import Controller
const UserController = require("./../controllers/UserController")

Router.post("/login", UserController.login)

module.exports = Router