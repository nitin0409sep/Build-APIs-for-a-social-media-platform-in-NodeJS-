// Express
const express = require('express');

// Route
const route = express.Router();

// Authentication
const auth = require('../authentication/auth');

// Home
const home = require('../routes/Home/home');

// User
const user = require('../routes/User/user');

// Post
const posts = require('../routes/Post/post');

// Home
route.get('/api/user', home.getUserHome);                          // GET User Home
route.get('/api/posts', home.getPostHome);                         // GET Post Home

// User - Register, Login, Update, Delete, Follow, Unfollow
route.post('/api/registerUser', user.createUser);                  // Create User
route.get('/api/authenticate', user.authenticate);                 // Authenticate User
route.get('/api/user/:id', auth, user.findUserById);               // Get User By Id
route.post('/api/updateUser/:id', auth, user.updateUser);          // Update User
route.post('/api/follow/:id', auth, user.followUser);              // Follow User
route.post('/api/unfollow/:id', auth, user.unFollowUser);          // Unfollow User
route.delete('/api/deleteUser/:id', auth, user.deleteUser);        // Delete User

// Post - Create, Get, Update, Delete, Like, Dislike, Comment
route.post('/api/posts', auth, posts.createPost);                  // Create User
route.get('/api/posts/:id', auth, posts.getPost)                   // Get Post
route.get('/api/all_posts', auth, posts.getAllPost)                // Get Tmeline Posts
route.post('/api/updatePost/:id', auth, posts.updatePost)          // Update Post
route.post('/api/like/:id', auth, posts.likePost)                  // Like Post
route.post('/api/unlike/:id', auth, posts.dislikePost)             // Dislike Post
route.post('/api/comment/:id', auth, posts.commentPost)            // Comment Post
route.delete('/api/posts/:id', auth, posts.deletePost)             // Delete Post

// Export Module
module.exports = route;
