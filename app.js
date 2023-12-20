const express = require("express")
const app = express();
const bodyParser = require("body-parser")

const feedRoutes = require("./routes/feedRoutes")

app.use(bodyParser.json()); //application/json

app.use('/feed',feedRoutes);

app.listen(8080, ()=> {
    console.log("Server online... :o)")
})

