const mongoose = require('mongoose')

const { MONGODB_URl } = process.env

exports.connect = () => {
    mongoose.connect( MONGODB_URl , {
        //must add in order to not get any error masseges:
        useUnifiedTopology:true,
        useNewUrlParser: true 
        
    }).then(
        console.log("DB CONNECTED SUCCESS")
    ).catch(error => {
        console.log("DB CO NNECTION FAILED ", error)
        process.exit(1)

    })
}
