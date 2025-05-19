
const express = require('express')
const app = express();
const sequelize = require("./config/db");
const routes = require('./routes'); 

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 

//routes
app.use('/api', routes); 


sequelize.sync({
    force: false,
});



app.get('/', (req, res) => {
    res.status(200).json({message: "okay"})
});



module.exports = app; 