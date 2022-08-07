const mongoose = require('mongoose')
 function connect (){
    const uri = 'mongodb+srv://Khan:khan1234@cluster0.w4qpd.mongodb.net/komakdb?retryWrites=true&w=majority'
    try{
         mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true })
        const connection = mongoose.connection;
        connection.once('open', () => {
        console.log("MongoDB database connection established successfully");
        })
    }catch(e){
        console.log(e)
    }
}

module.exports = connect