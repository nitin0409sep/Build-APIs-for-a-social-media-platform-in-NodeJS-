// Mongoose
const mongoose = require('mongoose');

// Schema
const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    tittle: {
        type: String,
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    },
    comments: [{
        comment: String,
        userId: String
    }]
}, {
    timestamps: true
});

// Model
const Post = new mongoose.model('Post', postSchema);

// Export Module
module.exports = Post;

