const express = require("express")
const Router = express.Router()

// Import Controller
const ProjectContoller = require("./../controllers/Projectcontroller")

// Import Middleware
const jwtVerify = require("./../middleware/JWT")
const multerUpload = require("./../middleware/multer")

Router.post("/addData",jwtVerify, ProjectContoller.addData)
Router.post("/getData",jwtVerify, ProjectContoller.getData)

// Multer
Router.post("/upload-image", ProjectContoller.uploadimage)
Router.get("/get-product", ProjectContoller.getProduct)
Router.delete("/delete-product/:idProduct", ProjectContoller.deleteProduct)
Router.get("/project-detail/:idProduct", ProjectContoller.projectDetail)

module.exports = Router