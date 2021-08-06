const fs = require("fs")

// let files = [`../images_products/file1.txt`,`../images_products/file2.txt`,`../images_products/file3.txt`]

const deleteFiles = (files) => {
    files.forEach((value) => {
        fs.unlink(value, function(err) {
            try {
                if(err) throw err
            } catch (error) {
                console.log(error)
            }
        })
    })
}

module.exports = deleteFiles