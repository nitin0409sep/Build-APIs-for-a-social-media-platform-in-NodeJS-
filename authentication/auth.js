// User
const User = require('../model/User/User');

// JWT
const jwt = require('jsonwebtoken');

// Authentication
const auth = async (req, res) => {

    try {
        // Get Cookie/Token from Browser
        const token = req.cookies.jwt;

        // Verifying Token
        const verifyToken = jwt.verify(token, "hellomysecretkey");

        // User verification from DB
        const user = await User.findOne({ _id: verifyToken._id });

        // Valid User
        if (user) {
            next();
        } else {
            res.status(400).json("Log In");
            throw new Error("Log in first");
        }
    } catch (err) {
        res.status(400).json(err);
    }
}


// Exports Module
module.exports = auth;
