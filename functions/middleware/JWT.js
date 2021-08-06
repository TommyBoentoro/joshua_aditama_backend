const jwt = require('jsonwebtoken')

const jwtVerify = (req, res, next) => {
    const token = req.body.token

    if(!token) return res.status(406).send({ error: true, message: 'Token Not Found' })

    jwt.verify(token, '123abc', (err, dataToken) => {
        try {
            if(err) throw err
            console.log(dataToken)
            req.dataToken = dataToken
            next()
        } catch (error) {
            res.status(500).send({
                error: true,
                message: error.message
            })
        }
    })
}

module.exports = jwtVerify