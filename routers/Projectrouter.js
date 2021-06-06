const express = require("express")
const Router = express.Router()

// Import Controller
const ProjectContoller = require("./../controllers/Projectcontroller")

// Import JWT
const jwtVerify = require("./../middleware/JWT")

Router.post("/addData",jwtVerify, ProjectContoller.addData)
Router.post("/getData",jwtVerify, ProjectContoller.getData)

module.exports = Router