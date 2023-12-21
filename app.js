const express = require("express")
const app = express();
//const bodyParser = require("body-parser")

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const feedRoutes = require("./routes/feedRoutes")

//app.use(bodyParser.json()); //application/json

app.use(express.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed',feedRoutes);

app.listen(8080, ()=> {
    console.log("Server online... :o)")
})

