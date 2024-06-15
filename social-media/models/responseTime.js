const mongoose = require('mongoose');

const ResponseTime = new mongoose.Schema({
    path: { type: String, required: true },
    time: { type: Number, required: true },

 },
 {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
ResponseTime.index({ path: 1 });

module.exports = mongoose.model('ResponseTime', ResponseTime);
