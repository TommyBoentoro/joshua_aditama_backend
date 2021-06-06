// Initialize all library
const express = require("express")
const app = express()
const cors = require("cors")

// Import Routers
const userRouter = require("./routers/Userrouter")
const projectRouter = require("./routers/Projectrouter")

// initialize cors -> biar API bisa diakses front-end
app.use(cors())

// Initialize body parser
app.use(express.json())

// initialize PORT
const PORT = 4000

// Route
app.get("/", (req,res)=> {
    res.status(200).send(
        `<h1> Backend Joshua website </h1>`
    )
})

app.use("/user-system", userRouter)
app.use("/data-system", projectRouter)



app.listen(PORT, () =>console.log(`API RUNING ON PORT` + " " + PORT) )