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
route.get('/api/user', home.getUserHome);                   // GET User Home
route.get('/api/posts', home.getPostHome);                  // GET Post Home

// User - Register, Login, Update, Delete, Follow, Unfollow
route.post('/api/registerUser', user.createUser);           // Create User
route.get('/api/authenticate', user.authenticate);          // Authenticate User
route.get('/api/user/:id', user.findUserById);              // Get User By Id
route.put('/api/updateUser/:id', user.updateUser);          // Update User
route.put('/api/follow/:id', user.followUser);              // Follow User
route.put('/api/unfollow/:id', user.unFollowUser);          // Unfollow User
route.delete('/api/deleteUser/:id', user.deleteUser);       // Delete User

// Post - Create, Get, Update, Delete, Like, Dislike, Comment
route.post('/api/posts', posts.createPost);                 // Create User
route.get('/api/posts/:id', posts.getPost)                  // Get Post
route.get('/api/all_posts', posts.getAllPost)               // Get Tmeline Posts
route.put('/api/updatePost/:id', posts.updatePost)          // Update Post
route.put('/api/like/:id', posts.likePost)                  // Like Post
route.put('/api/unlike/:id', posts.dislikePost)             // Dislike Post
route.put('/api/comment/:id', posts.commentPost)            // Comment Post
route.delete('/api/posts/:id', posts.deletePost)            // Delete Post

// Export Module
module.exports = route;
