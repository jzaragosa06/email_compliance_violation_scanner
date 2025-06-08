
const express = require('express');
const app = express();
const sequelize = require("./config/db");
const routes = require('./routes'); 
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const { initializeEmailAnalysisJobs } = require('./jobs/emailAnalysis.job');

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: [process.env.VITE_FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
}));

//routes
app.use('/api', routes); 

// sequelize.sync({
//     force: true,
// });

sequelize.sync(); 

//because await doesnt work on top level files on common js 
// i.e., just await initializeEmailAnalysisJobs();
//but will work on mjs. 
(async () => {
    await sequelize.sync(); 
    await initializeEmailAnalysisJobs();
})();



app.get('/', (req, res) => {
    res.status(200).json({message: "okay"})
});



module.exports = app; 