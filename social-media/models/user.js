const mongoose = require('mongoose');

const user = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    login_count: { type: Number, default: 0 },
    logout_count: { type: Number, default: 0 }
});

// Index on post_id for quick retrieval
user.index({ user_id: 1 });

module.exports = mongoose.model('User', user);
