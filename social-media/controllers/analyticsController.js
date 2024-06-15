const Post = require('../models/post');
const Event = require('../models/event');

const getTimeRange = (unit) => {
    const now = new Date();
    let startTime;
    switch (unit) {
        case 'minute':
            startTime = new Date(now.getTime() - 60 * 1000);
            break;
        case 'hour':
            startTime = new Date(now.getTime() - 60 * 60 * 1000);
            break;
        case 'day':
            startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        default:
            throw new Error('Invalid time unit');
    }
    return { startTime, endTime: now };
};

const getPopularPosts = async (unit) => {
    const { startTime, endTime } = getTimeRange(unit);
    const popularPosts = await Post.aggregate([
        { $match: { updatedAt: { $gte: startTime, $lte: endTime } } }
    ])
    .sort({ updatedAt: -1, likes_count: -1, comments_count: -1, shares_count: -1 })
    .limit(10);
    return popularPosts;
};

const getActiveUsers = async (unit) => {
    const { startTime, endTime } = getTimeRange(unit);
    const activeUsers = await Event.aggregate([
        { $match: { updatedAt: { $gte: startTime, $lte: endTime } } },
        { $group: { _id: "$user_id" } },
        { $group: { _id: null, count: { $sum: 1 } } }
    ]);
    return activeUsers;
}

exports.getPopularPosts = async (req, res) => {
    const { unit } = req.query; // unit can be "minute", "hour", or "day"
    console.log(unit);
    if (!['minute', 'hour', 'day'].includes(unit)) {
        return res.status(400).json({ error: 'Invalid time unit' });
    }

    try {
        const popularPosts = await getPopularPosts(unit);
        res.status(200).json(popularPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getActiveUsers = async (req, res) => {
    const { unit } = req.query; // unit can be "minute", "hour", or "day"
    console.log(unit);
    if (!['minute', 'hour', 'day'].includes(unit)) {
        return res.status(400).json({ error: 'Invalid time unit' });
    }

    try {
        const activeUsers = await getActiveUsers(unit);
        res.status(200).json(activeUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
