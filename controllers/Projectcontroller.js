const db = require("../connection/Connection")

const addData = (req,res)=> {
    try {
        // Get all Data
        let data = req.body
        let dataToken = req.dataToken
        console.log(data)
        console.log(dataToken)

        // Verifikasi all data
        if(!data.title || !data.description) throw {message: `All data must be filled`}

        let dataToInsert = {
            title: data.title,
            description: data.description,
            user_id: dataToken.id
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

module.exports={
    addData: addData,
    getData: getData
}