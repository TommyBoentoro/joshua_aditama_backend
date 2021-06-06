const db = require("../connection/Connection")
const jwt = require("jsonwebtoken")

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

module.exports = {
    login: login
}