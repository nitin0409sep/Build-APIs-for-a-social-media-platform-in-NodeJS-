// User Model
const User = require('../../model/User/User');

// Bcrypt
const bcrypt = require('bcryptjs');
const { use } = require('../../controller/controller');

// Get User
module.exports.getUser = (req, res) => {
    res.send("Get User");
}

// Create/Register User
module.exports.createUser = async (req, res) => {

    // Getting User Data
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })

    // Try-Catch
    try {

        // JWT Token
        const token = await user.generateAuthToken();

        // Cookies
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 300000)
        });

        // Saving it to DB
        const data = await user.save();

        // Return Response
        res.status(200).json(data);
    } catch (err) {
        // Error
        res.status(400).send("Error" + err);
    }
}


// Authenticate User
module.exports.authenticate = async (req, res) => {
    try {
        // Get from user
        const email = req.body.email;

        // Getting data from db if present
        const user = await User.findOne({ email: email });

        // No user found - null will be returned
        if (user == null) {
            // Wrong Email
            res.status(400).send("Invalid Credentials");
        } else {

            // Checking Password - Returns a Promise
            const password = await user.loginMethod(req.body.password);

            // True-False
            if (password == true) {

                // JWT Token 
                const token = await user.generateAuthToken();

                // Cookies
                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + 300000)
                });

                // Send Response
                res.status(200).json("JSON Web Token" + token);
            } else {
                // Wrong Password
                res.status(400).send("Invalid Credentials");
            }
        }
    } catch (err) {
        res.status(400).send("Invalid Credentials" + "Err" + err);
    }
}

// Get User By User Id
module.exports.findUserById = async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        try {
            // Finding User by ID 
            const data = await User.findById({ _id: req.params.id });

            // If user does not exists
            if (data == null) {
                res.status(200).json("User does not exist.");
            } else {

                // Spread Operator- Storing Data in var's from DB as we dont want to send all details 
                const { email, profileImg, password, coverImg,
                    desc, createdAt, updatedAt, isAdmin, ...others
                } = data._doc;

                // Using Spread Operator
                let { name, followers, following } = others;

                // Response if User Exists
                res.status(200).json({
                    "Name": name,
                    "Followers": followers.length,
                    "Following": following.length
                });
            }
        } catch (err) {
            res.status(400).json(err);
        }

    } else {
        res.status(403).json("You can see only your account details boss!")
    }
}

// Update User
module.exports.updateUser = async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {

        if (req.body.password) {
            try {
                // Hash Password if updated
                req.body.password = await bcrypt.hash(req.body.password, 10);
            } catch (err) {
                return res.status(400).json(err);
            }
        }

        try {
            const data = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            });

            // Response
            res.status(200).json("Updated Successfully");
        } catch (err) {
            res.status(400).json(err);
        }

    } else {
        res.status(403).json("You can update only your account boss!")
    }
}


// Delete User
module.exports.deleteUser = async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        try {
            // Finding by ID and Deleteing the User
            const data = await User.findByIdAndDelete(req.params.id);

            if (data == null) {
                res.status(200).json("User does not exist or Already Deleted.");
            } else {
                // Response
                res.status(200).json("Deleted Successfully");
            }
        } catch (err) {
            res.status(400).json(err);
        }

    } else {
        res.status(403).json("You can delete only your account boss!")
    }
}


// Follow User
module.exports.followUser = async (req, res) => {
    // Check users are same or not
    if (req.body.userId !== req.params.id || req.body.isAdmin) {

        try {
            // User
            const user = await User.findById(req.params.id);

            // Current User
            const currUser = await User.findById(req.body.userId);

            // Following or Not
            if (!user.followers.includes(req.body.userId)) {

                // User
                await user.updateOne({
                    $push: {    // using push as we have an array of followers
                        followers: req.body.userId
                    }
                })

                // Current User
                await currUser.updateOne({
                    $push: {
                        following: req.params.id
                    }
                })

                // Response
                res.status(200).send("You have followed user successfully.")
            } else {
                // If users are same i.e the person want to follow user that has he/she already follows
                res.status(403).json("You already following the person boss!");
            }


        } catch (err) {
            res.status(500).json(err);
        }

    } else {
        res.status(403).json("You can't follow yourself boss!")
    }
}


// Unfollow User
module.exports.unFollowUser = async (req, res) => {

    // Check users are same or not
    if (req.body.userId !== req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findById(req.params.id);
            const currUser = await User.findById(req.body.userId);

            // Following or Not
            if (user.followers.includes(req.body.userId)) {
                // User
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId
                    }
                })

                // Current User
                await currUser.updateOne({
                    $pull: {
                        following: req.params.id
                    }
                })

                // Response
                res.status(200).send("You have unfollowed user successfully.")
            } else {
                // If users are same i.e the person want to unfollow her/him self
                res.status(403).json("You are not following the person boss!");
            }


        } catch (err) {
            // Error
            res.status(500).json(err);
        }

    } else {
        // When user and currUser are same
        res.status(403).json("You can't unfollow yourself boss!")
    }
}

