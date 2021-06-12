const db = require("../connection/Connection")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const fs = require("fs")
const handlebars = require("handlebars")

const login = (req,res) => {
    // get all data
    const data = req.body
    console.log(data)

    // Verifikasi data ada
    if(!data.username || !data.password) throw (`Data must be filled`)

    // Cari data di database , kalau ada baru login
    db.query(`SELECT * FROM user WHERE username = ? AND password = ?`,[data.username, data.password], (err,result)=>{
        try {
            if(err) throw err

            if(result.length === 1){
                jwt.sign({id: result[0].id, username: result[0].username, password: result[0].password}, "123abc", (err,token) => {
                    try {
                        if(err) throw err

                        res.status(200).send({
                            error:false,
                            message: "Login Success",
                            data: {
                                token: token
                            }
                        })
                    } catch (error) {
                        res.status(500).send({
                            error:true,
                            message:`Token Error`
                        })
                    }
                })
               
            }else{
                res.status(200).send({
                    error:true,
                    message: `Email & Password Does Not Match`
                })
            }
            
            
        } catch (error) {
            res.status(500).send({
                error: true,
                message: error.message
            }
                
            )
        }
    })

}

// Node mailer
const trasnporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jaditamawebsite@gmail.com" ,
        pass: "cbwpdkyytlinsfrm"
    },
    tls: {
        rejectUnauthorized: false
    }
})

const sendEmail = (req,res) => {
        const data = req.body
  

        const dataToSend = {
            email : data.email,
            name : data.name,
            contact : data.contact,
            letter : data.letter
        }
    
        console.log(dataToSend)

        fs.readFile(`D:/Project/Joshua Aditaama's/joshua_aditama_backend/template/message.html`, {encoding: `utf-8`}, (err,file) => {
            if(err) throw err

            const message = handlebars.compile(file)
            const messageresult = message({email: data.email, name: data.name, contact: data.contact, letter: data.letter})
            trasnporter.sendMail({
                from: "jaditamawebsite@gmail.com", // Sender Adress
                to: "tommybun97@gmail.com",
                subject: "Message From Joshua's Website",
                html : messageresult
            })
            .then((response) => {
                res.status(200).send({
                    error: false,
                    message: `Message berhasil terkirim`
                })
            })
            .catch((error) => {
                res.status(500).send({
                    error: true,
                    message: error.message
                })
            })
            
        })
}


module.exports = {
    login: login,
    sendEmail: sendEmail
    
}