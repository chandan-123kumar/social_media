const Post = require('../models/post');
const Event = require('../models/event');
const ResponseTime = require('../models/responseTime');

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

const weights = {
    likes: 1,
    comments: 2,
    shares: 3
};

const getPopularPosts = async (unit) => {
    const { startTime, endTime } = getTimeRange(unit);
    const posts = await Post.find(
        { updatedAt: { $gte: startTime } }
    );
    const postsWithScores = posts.map(post => {
        const popularity_score = (post.likes_count * weights.likes) +
                                 (post.comments_count * weights.comments) +
                                 (post.shares_count * weights.shares);
        return { ...post.toObject(), popularity_score };
    });
    postsWithScores.sort((a, b) => b.popularity_score - a.popularity_score);
    return postsWithScores.slice(0, 10);
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
exports.getResponseTime = async(req, res) => {
    const { path } = req.query;
    try {
        const responseTime = await ResponseTime.find({ path: path });
        res.status(200).json(responseTime);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.getActiveUsers = async (req, res) => {
    const { unit } = req.query; // unit can be "minute", "hour", or "day"
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
