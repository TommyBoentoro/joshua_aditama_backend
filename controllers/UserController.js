const db = require("../connection/Connection")

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
                db.query(`UPDATE user SET is_login = 1 WHERE username = ? AND password = ?`, [data.username, data.password],(err,result) => {
                    try {
                        if(err) throw err

                        res.status(200).send({
                            error: false,
                            message: `Login Success`
                        })
                    } catch (error) {
                        res.status(500).send({
                            error: true,
                            message: error.message
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