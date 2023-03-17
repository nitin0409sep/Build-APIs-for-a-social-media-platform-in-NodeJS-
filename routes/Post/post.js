// Post Model
const Post = require('../../model/Post/Post');

// Create Post
module.exports.createPost = async (req, res) => {
    try {

        // Creating a new Post
        const post = new Post(req.body);

        // Saving it to DB
        const data = await post.save();

        const { _id, tittle, desc, createdAt, ...others } = data._doc;

        // Response
        res.status(200).json({
            "Post Id": _id,
            "Title": tittle,
            "Description": desc,
            "Created Time": createdAt
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

// Get Post
module.exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json(err);
    }
}

// Get All Posts
module.exports.getAllPost = async (req, res) => {
    const arr = [];

    try {
        const post = await Post.find();

        post.forEach((e) => {
            const { _id, tittle, desc, createdAt, comments, likes } = e._doc;
            arr.push({
                "_id": _id,
                "title": tittle,
                "description": desc,
                "created_at": createdAt,
                "comments": comments.length,
                "likes": likes.length
            });
        })

        res.status(200).json(arr);
    } catch (err) {
        res.status(400).json(err);
    }
}

// Update Post
module.exports.updatePost = async (req, res) => {
    try {
        // Fetch data from DB if exists regarding ID
        const post = await Post.findById(req.params.id);

        if (req.body.userId == post.userId) {

            // Update Post
            const data = await Post.updateOne({ _id: req.params.id }, {
                $set: req.body
            }, {
                new: true
            })

            // Response
            res.status(200).json("Post updated successfully");

        } else {
            res.status(400).json("You can only update your Post");
        }

    } catch (err) {
        res.status(500).json(err);
    }
}


// Delete Post
module.exports.deletePost = async (req, res) => {
    try {
        // Fetch data from DB if exists regarding ID
        const post = await Post.findById(req.params.id);

        if (req.body.userId == post.userId) {

            // Delete Post
            const data = await Post.deleteOne({ _id: req.params.id })

            // Response
            res.status(200).json("Post deleted successfully");

        } else {
            res.status(400).json("You can only delete your Post");
        }

    } catch (err) {
        res.status(500).json(err);
    }
}


// Like Post
module.exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post is liked.");
        } else {
            res.status(200).json("You had already liked this post boss!")
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// Dislike Post
module.exports.dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.likes.includes(req.body.userId)) {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post is unliked.");
        } else {
            res.status(200).json("You hadn't liked this post boss!")
        }
    } catch (err) {
        res.status(500).json(err);
    }
}


// Comment Post
module.exports.commentPost = async (req, res) => {
    try {
        // Post
        const post = await Post.findById(req.params.id);

        // Update Comment
        await post.updateOne({
            $set: {
                comments: {
                    comment: req.body.comment,
                    userId: req.body.userId
                }
            }
        }, { new: true });

        const { comments } = post._doc;

        // Response
        res.status(200).json(comments[0]._id);

    } catch (err) {
        res.status(500).json(err);
    }
}
