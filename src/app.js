
const express = require('express')
const app = express();
const sequelize = require("./config/db");
const { allRoutes } = require('./routes');


app.use(express.urlencoded({extended: true}));
app.use(express.json()); 

//routes
allRoutes(app);

sequelize.sync({
    force: false,
}).then(() => {
    console.log('Database synced');
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
})

app.get('/', (req, res) => {
    res.status(200).json({message: "okay"})
});



module.exports = app; 