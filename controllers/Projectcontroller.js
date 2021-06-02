const db = require("../connection/Connection")

const addData = (req,res)=> {
    try {
            // Get all Data
        const data = req.body
        console.log(data)

        // Verifikasi all data
        if(!data.title || !data.description) throw {message: `All data must be filled`}

        let dataToInsert = {
            title: data.title,
            description: data.description
        }

        // Insert data
        db.query(`INSERT INTO dataproject SET ?`, [data.title, data.description], (err,result)=> {
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
    db.query(`SELECT * FROM dataproject`, (err,result) => {
        try {
            if(err) throw err

            res.status(200).send({
                error:false,
                message: result
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