// Mongoose
const mongoose = require('mongoose');

// Bcrypt
const bcrypt = require('bcryptjs');

// JWT
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 65,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 4
    },
    profileImg: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        max: 50,
        default: ""
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3]
    }
},
    {
        timestamps: true
    })


// Fire a function before doc saved to db
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            // Hashing the password
            this.password = await bcrypt.hash(this.password, 10);
        }
    } catch (err) {
        console.log(err);
    }
    next();
})


// Check the Password is Correct or Not
userSchema.methods.loginMethod = async function (userPassword) {
    try {
        const val = await bcrypt.compare(userPassword, this.password);
        return val;
    } catch (err) {
        console.log(`Login Password Checking ${err}`);
    }
}

// Generate JWT Token 
userSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id }, "hellomysecretkey");
        return token;
    } catch (err) {
        res.status(400).json(err);
    }
}


// User Model
const User = new mongoose.model('User', userSchema);

// Export Module
module.exports = User;