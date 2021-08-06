const db = require("../connection/Connection")
const multer = require("multer")


const express = require("express")
const app = express()

app.use(`/images_upload`, express.static(`images_upload`));


const deleteFiles = require("./../helpers/deleteFiles")

// Async await
const util = require("util")

const query = util.promisify(db.query).bind(db)


const addData = (req,res)=> {
    try {
        // Get all Data
        let data = req.body
        let dataToken = req.dataToken
        // console.log(data)
        console.log(dataToken)

        // Verifikasi all data
        if(!data.title || !data.description || !data.head_description || !data.status || !data.location || !data.category ||!data.year) throw {message: `All data must be filled`}

        let dataToInsert = {
            title: data.title,
            description: data.description,
            user_id: dataToken.id,
            head_description: data.head_description,
            status : data.status,
            location: data.location,
            category: data.category,
            year: data.year
        }

        // Insert data
        db.query(`INSERT INTO dataproject SET ?`, dataToInsert, (err,result)=> {
            try {
                if(err) throw err

                res.status(200).send({
                    error: false,
                    message: `Add Data Success`
                })
                
            } catch (error) {
                res.status(500).send({
                    error: true,
                    message: error.message
                })
            }
        })
    } catch (error) {
        res.status(406).send({
            error: true,    
            message: error.message
        })
    }
}

const getData = (req,res) => {

    // Get Data Token
    let dataToken = req.dataToken
    let idUser = req.dataToken.id

    db.query(`SELECT * FROM dataproject WHERE user_id = ${idUser}` , (err,result) => {
        try {
            if(err) throw err


            res.status(200).send({
                error:false,
                message: `Get Data Success`,
                Data: result
            })
        } catch (error) {
            res.status(500).send({
                error:true,
                message: error.message
            })
        }
    })

}

// Setting Multer
const { defaultMaxListeners } = require("events")
// const { query } = require("../connection/Connection")

let storage = multer.diskStorage({
    destination: function(req,file,next){
        next(null, "images_upload")
    },
    filename : function(req,file,next){
        console.log(file)
        next(null, file.originalname + "-" + Date.now() + "." + file.mimetype.split("/")[1]) 
    }
})

function fileFilter(req,file,next){
    if(file.mimetype.split("/")[0] === "image"){
        next(null,true)
    }else if(file.mimetype.split("/")[0] !== "image"){
        next (new Error (`File Must Be Image`))
    }
}


let multipleUpload = multer({storage:storage, fileFilter:fileFilter, limits:{fileSize: 2000000}}).array(`images`,10)

const uploadimage = (req,res) => {
    multipleUpload(req,res, (err) => {
        try {
            if(err) throw err
            if(req.files === undefined || req.files.length === 0) throw {message: `File not found`}
            
            let data = req.body.data
            let dataParsed
            try {
                dataParsed = JSON.parse(data)  
            } catch (error) {
                res.status(500).send({
                    error: true,
                    message: `Error data parse`
                })
            }
            console.log(dataParsed)

            db.beginTransaction((err) =>{
                try {
                    if(err) throw err
                    db.query(`SELECT * FROM user WHERE id = 1`, (err,result) => {
                        try {
                            if(err) throw err

                            db.query(`INSERT INTO dataproject SET ?`, dataParsed, (err,result) => {
                                try {
                                    

                                    if(err) {
                                        deleteFiles(filesPathLocation)
                
                                        return db.rollback(() => {
                                            throw(err)
                                        })
                                    }
                                    let filesPathLocation = req.files.map((value) => value.path)
                                    console.log(filesPathLocation)
                                    
                                    console.log(result.insertId)
                                    let dataproject_id = result.insertId
                                    let dataproject_user_id = 1
                
                
                                    let imagePathLocation = req.files.map((value) => {
                                        return[
                                            `http://localhost:4000/${value.path}`, dataproject_id, dataproject_user_id
                                        ]
                                    })
                                    console.log(imagePathLocation)
                                    
                                   
                
                
                                   db.query (`INSERT INTO data_image (image, dataproject_id, dataproject_user_id) VALUES ?`, [imagePathLocation], (err,result) => {
                                       try {
                                           if(err) {
                                                deleteFiles(filesPathLocation)
                    
                                                return db.rollback(() => {
                                                    throw(err)
                                                })
                                           }
        
                                           db.commit((err) => {
                                               if(err){
                                                deleteFiles(filesPathLocation)
                
                                                return db.rollback(() => {
                                                    throw(err)
                                                })
                                               }
                                           })
                
                                           res.status(200).send({
                                               error: false,
                                               message: `Upload Success`
                                           })
                                       } catch (error) {
                                           res.status(500).send({
                                               error: true,
                                               message: error.message
                                           })
                                       }
                                   })
                                } catch (error) {
                                    res.status(500).send({
                                        error: true,
                                        message: `Error insert data product`,
                                        detail : error.message
                                    })
                                }
                            })
                        } catch (error) {
                            res.status(500).send({
                                error: true,
                                message: `id 1 not found`,
                                detail: error.message
                            })
                        }
                    })
                    
                } catch (error) {
                    res.status(500).send({
                        error: true,
                        message: `Begin Transaction error`,
                        detail: error.message
                    })
                }
            })
           
          
        } catch (error) {
            res.status(500).send({
                error: true,
                message: error.message
            })
        }
    })
}


const getProduct = (req,res) => {
    db.query(`SELECT d.id, d.title, d.description, d.head_description, d.status, d.location, d.year, d.category, d.descriptionDua, d.id AS image_id, di.image FROM dataproject d JOIN
    data_image di ON di.dataproject_id = d.id`, (err,result) => {
        try {
            if(err) throw err
                let dataTransformed = []

                result.forEach((value) => {
                    let idProductExist = null

                    dataTransformed.forEach((val,index) => {
                        if(val.id === value.id){
                            idProductExist = index
                        }
                    })

                    if(idProductExist === null){
                        dataTransformed.push(
                            {
                                id: value.id,
                                title:value.title,
                                status: value.status,
                                location: value.location,
                                category: value.category,
                                year: value.year,
                                head_description: value.head_description,
                                description: value.description,
                                user_id: value.user_id,
                                descriptionDua: value.descriptionDua,
                                image : [
                                    {
                                        dataproject_id: value.dataproject_id, image: value.image
                                    }
                                ]
                            }
                        )
                    }else{
                        dataTransformed[idProductExist].image.push(
                            {
                                dataproject_id: value.dataproject_id, image: value.image
                            }
                        )
                    }
                })
            res.status(200).send({
                error: false,
                message: `Get data success`,
                detail: dataTransformed
            })
        } catch (error) {
            res.status(500).send({
                error: true,
                message:error.message
            })
        }
    })
}

const projectDetail =  (req,res) => {
    let idProduct = req.params.idProduct
    console.log(idProduct)

    db.query(`SELECT d.id, d.title, d.description, d.head_description, d.status, d.location, d.year, d.category, d.descriptionDua, d.id AS image_id, di.image FROM dataproject d JOIN
    data_image di ON di.dataproject_id = d.id WHERE d.id = ?`, idProduct, (err,result) => {
        try {
            if(err) throw err
                let dataTransformed = []

                result.forEach((value) => {
                    let idProductExist = null

                    dataTransformed.forEach((val,index) => {
                        if(val.id === value.id){
                            idProductExist = index
                        }
                    })

                    if(idProductExist === null){
                        dataTransformed.push(
                            {
                                id: value.id,
                                title:value.title,
                                status: value.status,
                                location: value.location,
                                category: value.category,
                                year: value.year,
                                head_description: value.head_description,
                                description: value.description,
                                user_id: value.user_id,
                                descriptionDua: value.descriptionDua,
                                image : [
                                    {
                                        dataproject_id: value.dataproject_id, image: value.image
                                    }
                                ]
                            }
                        )
                    }else{
                        dataTransformed[idProductExist].image.push(
                            {
                                dataproject_id: value.dataproject_id, image: value.image
                            }
                        )
                    }
                })
            res.status(200).send({
                error: false,
                message: `Get data success`,
                detail: dataTransformed
            })
        } catch (error) {
            res.status(500).send({
                error: true,
                message: `Error Get Data`,
                detail: error.message
            })
        }
    })
}

const deleteProduct = async (req,res) => {
    let idProduct = req.params.idProduct
    console.log(idProduct)

    // Initialize all query
    let query1 = `SELECT * FROM dataproject WHERE id =?`
    let query2 = `SELECT * FROM data_image WHERE dataproject_id = ?`
    let query3 = `DELETE FROM data_image WHERE dataproject_id =?`
    let query4 = `DELETE FROM dataproject WHERE id =?`


    try {
        if(!idProduct) throw {message:` ID product cannot Null`}

        await query (`Start Transaction`)
        const findProduct = await query(query1, idProduct)
        .catch((error) => {
            throw error
        })

        if(findProduct.length === 0){
            throw {message:"id product not found"}
        }

        const findImage = await query(query2, idProduct)
        .catch((error) => {
            throw error
        })

        console.log(findImage)

        let oldFilesPatchLocation = findImage.map((value) => {
            return value.image.replace(`http://localhost:4000/`, ``)
        })

        console.log(oldFilesPatchLocation)

        const deleteImage = await query(query3, idProduct)
        .catch((error) => {
            throw error
        })

        const deleteProduct = await query(query4, idProduct)
        .catch((error)=>{
            throw error
        })

        deleteFiles(oldFilesPatchLocation)

        await query(`commit`)
        res.status(200).send({
            error:false,
            message:`Delete data success`
        })

    } catch (error) {
        res.status(406).send({
            error: true,
            message: `Id product not found`,
            detail : error.message
        })
    }
}


module.exports={
    addData: addData,
    getData: getData,
    uploadimage: uploadimage,
    getProduct : getProduct,
    deleteProduct: deleteProduct,
    projectDetail:projectDetail
}