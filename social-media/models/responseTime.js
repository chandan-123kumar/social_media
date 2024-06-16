const mongoose = require('mongoose');

const responseTime = new mongoose.Schema({
    path: { type: String, required: true },
    time: { type: Number, required: true },

 },
 {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
responseTime.index({ path: 1 });

module.exports = mongoose.model('ResponseTime', responseTime);
