const mongoose = require('mongoose');

const post = new mongoose.Schema({
    post_id: { type: String, required: true, unique: true },
    post_content: { type: String, required: true},
    user_id: { type: String, required: true }, // Reference to the user who made the post
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    shares_count: { type: Number, default: 0 }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Index on post_id for quick retrieval
post.index({ post_id: 1 });
post.index({ updatedAt: 1 });

// Compound index on updatedAt, likes_count, comments_count, and shares_count for sorting by popularity
post.index({ updatedAt: -1, likes_count: -1, comments_count: -1, shares_count: -1 });

module.exports = mongoose.model('Post', post);
