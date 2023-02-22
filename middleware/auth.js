const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => { 
    try {
        const headerToken = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(headerToken, 'hi')
        console.log(decoded)
        //find the user
        //const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        //find by id is better than find one
        const user = await User.findById(decoded._id)    
        if (!user) { throw new Error() }
        //checking for the token :')
        if (!user.tokens.some(token => token.token === headerToken)) { throw new Error()}
        // we store the user we brought from the data base rather 
        // than getting them again in the routehandler
        req.token = headerToken // we add the token to the request by making token property
        req.user = user //we add the user to the request  by making user property
        next()
    } catch (e) {  
        res.status(401).send({Error : "Your not authenticated"})
    }
}
module.exports = auth