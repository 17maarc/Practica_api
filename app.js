const express = require("express")

const dbConnect = require("./config/mongo.js")
require("dotenv").config();
const app = express();

app.use(express.json())

app.use("/api", require("./routes")) 

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is running en el puerto ${port}`)
    dbConnect()
})