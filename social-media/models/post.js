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
// Index on  updatedAt for quick retrieval based on timestam used to fetch popular post in past timerange(minute, hour, day)
post.index({ post_id: 1 });
post.index({ updatedAt: 1 });

module.exports = mongoose.model('Post', post);
