//-------------NPM Moduels-------------
const express = require('express')
require('./util/mongoose')
//-------------------------------------
/* notes
npx nodemon app  
npm install // command installs modules (depenencies) in package.json file 
npm run start // command that starts the project the way it is in package.json "start": "node app.js"
//keyboard short cuts for VS Code
Ctrl+K+C comment muliple line
Ctrl+K+U uncomment
Ctrl+D select next occurance
Ctrl+shift+L select all occurance
*/
//-------------------------------------
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')
const app = express();
app.use(express.json({limit : "1kb"})); //parser
//-------------------------------------


// will the code go through the rest of the the file if request doesnt start with /user?
app.use('/user', userRoutes)
app.use('/task', taskRoutes)

//--------------------------------------------------------
app.use('/*', (req, res) => { //ERROR 404

    res.status(404).send('request was not found')
})
app.listen(process.env.PORT, () => { 

    console.log(`server is up on port :${process.env.PORT}`)

})