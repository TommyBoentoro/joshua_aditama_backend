const express = require("express")
const Router = express.Router()

// Import MiddleWare
const jwtVerify = require("./../middleware/JWT")

// Import Controller
const UserController = require("./../controllers/UserController")

Router.post("/login", UserController.login)
Router.post("/change",jwtVerify, UserController.change)
Router.post("/send-email", UserController.sendEmail)
Router.post("/logout",jwtVerify, UserController.logout)

module.exports = Router