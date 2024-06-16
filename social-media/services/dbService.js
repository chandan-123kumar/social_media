const Event = require('../models/event');
const Post = require('../models/post');
const User = require('../models/user');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');

// Function to handle creating a post
const handleCreatePost = async (msg) => {
    const { user_id, post_content } = msg;
    const post = new Post({
        post_id: uuidv4(),
        post_content: post_content,
        user_id: user_id,
    });

    try {
        const newPost = await post.save();
    } catch (err) {
        logger.error('Error creating post:', err.message)
    }
};

// Function to handle login count
const handleLogin = async (msg) => {
    // Handle login logic
    const { user_id } = msg;
    try {
        const user = await User.findOneAndUpdate(
            { user_id: user_id },
            { $inc: { login_count: 1 }},
            { upsert: true, new: true }
        );
    } catch (err) {
        logger.error('loginCount not updated:', err.message);
    }
    logger.info(`User logged in: ${user_id}`);
};

// Function to handle logout
const handleLogout = async (msg) => {
     // Handle login logic
     const { user_id } = msg;
     try {
         const user = await User.findOneAndUpdate(
             { user_id: user_id },
             { $inc: { logout_count: 1 }},
             { upsert: true, new: true }
         );
     } catch (err) {
         logger.error('logoutCount updated:', err.message);
     }
     logger.info(`User logged out: ${user_id}`);
};

const handleLike = async (msg) => {
    const { post_id } = msg;

    try {
        const post = await Post.findOneAndUpdate(
            { post_id: post_id },
            { $inc: { likes_count: 1 }, $set: { updatedAt: new Date() } },
            { upsert: true, new: true }
        );
    } catch (err) {
        logger.error('Error liking post:', err.message);
    }
};

const handleUnlike = async (msg) => {
    const { post_id } = msg;

    try {
        const post = await Post.findOneAndUpdate(
            { post_id: post_id },
            { $inc: { likes_count: -1 }, $set: { updatedAt: new Date() } },
            { upsert: true, new: true }
        );
    } catch (err) {
        logger.error('Error unliking post:', err.message);
    }
};

const handleComment = async (msg) => {
    const { post_id } = msg;
    try {
        const post = await Post.findOneAndUpdate(
            { post_id: post_id },
            { $inc: { comments_count: 1 }, $set: { updatedAt: new Date() } },
            { upsert: true, new: true }
        );
    } catch (err) {
        logger.error('Error commenting post:', err.message);
    }
};

// Function to handle deleting a comment
const handleDeleteComment = async (msg) => {
    const { post_id } = msg;
    try {
        const post = await Post.findOneAndUpdate(
            { post_id: post_id },
            { $inc: { comments_count: -1 }, $set: { updatedAt: new Date() } },
            { upsert: true, new: true }
        );
    } catch (err) {
        logger.error('Error uncommenting post:', err.message);
    }
};

// Function to handle sharing a post
const handleShare = async (msg) => {
    const { post_id } = msg;

    try {
        const post = await Post.findOneAndUpdate(
            { post_id: post_id },
            { $inc: { shares_count: 1 }, $set: { updatedAt: new Date() } },
            { upsert: true, new: true }
        )
    } catch (err) {
        logger.error('Error sharing post:', err.message);
    }
};

// Main function to handle events
const handleEvent = async (msg) => {
    const event_type = msg.event_type;
    const event = new Event({
        event_id: uuidv4(),
        user_id: msg.user_id,
        event_type: event_type,
        metadata: msg.metadata || {}
    });

    try {
        await event.save();

        switch (event_type) {
            case 'login':
                await handleLogin(msg);
                break;
            case 'logout':
                await handleLogout(msg);
                break;
            case 'like':
                await handleLike(msg);
                break;
            case 'unlike':
                await handleUnlike(msg);
                break;
            case 'comment':
                await handleComment(msg);
                break;
            case 'delete_comment':
                await handleDeleteComment(msg);
                break;
            case 'create_post':
                await handleCreatePost(msg);
                break;    
            case 'share':
                await handleShare(msg);
                break;
            default:
                logger.info(`Invalid event type: ${event_type}`);
        }
    } catch (err) {
        logger.info('Error handling event:', err.message);
    }
}

module.exports = { handleEvent };
