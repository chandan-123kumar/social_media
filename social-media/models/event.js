const mongoose = require('mongoose');

const event = new mongoose.Schema({
    event_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    event_type: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed }
 }, {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);
event.index({ updatedAt: 1 });

module.exports = mongoose.model('Event', event);
