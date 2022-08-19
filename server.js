const express = require('express')
const app = express()
const path = require('path')


const cors = require('cors');
const connect_db = require('./connect_db')

const upload = require('express-fileupload')
app.use(express.static("public"));
app.use(upload())

app.use(cors());
app.use(express.json());

connect_db()


//apis
const user = require('./routes/apis/user')
app.use('/apis/user',user)

const post = require('./routes/apis/post')
app.use('/apis/post',post)

const admin = require('./routes/apis/admin')
app.use('/apis/admin',admin)

const driver = require('./routes/apis/driver')
app.use('/apis/driver',driver)



let host;
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
   host= add
   console.log("Your Host is "+add)
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
