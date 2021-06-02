const express = require("express")
const Router = express.Router()

// Import Controller
const ProjectContoller = require("./../controllers/Projectcontroller")

Router.post("/addData", ProjectContoller.addData)
Router.get("/getData", ProjectContoller.getData)

module.exports = Router