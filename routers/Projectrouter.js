const express = require("express")
const Router = express.Router()

// Import Controller
const ProjectContoller = require("./../controllers/Projectcontroller")

// Import Middleware
const jwtVerify = require("./../middleware/JWT")
const multerUpload = require("./../middleware/multer")

Router.post("/addData",jwtVerify, ProjectContoller.addData)
Router.post("/getData",jwtVerify, ProjectContoller.getData)
// Router.post("/uploadimage",multerUpload ,ProjectContoller.uploadImage)

module.exports = Router