const { handleEvent } = require('../../../services/dbService');
const Event = require('../../../models/event');
const Post = require('../../../models/post');
const User = require('../../../models/user');
const { v4: uuidv4 } = require('uuid');

jest.mock('../../../models/event');
jest.mock('../../../models/post');
jest.mock('../../../models/user');

describe('dbService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle login event', async () => {
        const msg = { event_type: 'login', user_id: 'user1' };

        User.findOneAndUpdate.mockResolvedValue({ user_id: 'user1', login_count: 1 });
        Event.prototype.save = jest.fn().mockResolvedValue();

        await handleEvent(msg);

        expect(Event.prototype.save).toHaveBeenCalledTimes(1);
        expect(User.findOneAndUpdate).toHaveBeenCalledWith(
            { user_id: 'user1' },
            { $inc: { login_count: 1 } },
            { upsert: true, new: true }
        );
    });

    it('should handle create post event', async () => {
        const msg = { event_type: 'create_post', user_id: 'user1', post_content: 'Hello World!' };

        Post.prototype.save = jest.fn().mockResolvedValue();
        Event.prototype.save = jest.fn().mockResolvedValue();

        await handleEvent(msg);

        expect(Event.prototype.save).toHaveBeenCalledTimes(1);
        expect(Post.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should handle like event', async () => {
        const msg = { event_type: 'like', post_id: 'post1' };

        Post.findOneAndUpdate.mockResolvedValue({ post_id: 'post1', likes_count: 1 });
        Event.prototype.save = jest.fn().mockResolvedValue();

        await handleEvent(msg);

        expect(Event.prototype.save).toHaveBeenCalledTimes(1);
        expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
            { post_id: 'post1' },
            { $inc: { likes_count: 1 }, $set: { updatedAt: expect.any(Date) } },
            { upsert: true, new: true }
        );
    });
    it('should handle uncomment event', async () => {
        const msg = { event_type: 'delete_comment', post_id: 'post1' };

        Post.findOneAndUpdate.mockResolvedValue({ post_id: 'post1', likes_count: 1 });
        Event.prototype.save = jest.fn().mockResolvedValue();

        await handleEvent(msg);

        expect(Event.prototype.save).toHaveBeenCalledTimes(1);
        expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
            { post_id: 'post1' },
            { $inc: { comments_count: -1 }, $set: { updatedAt: expect.any(Date) } },
            { upsert: true, new: true }
        );
    });

    it('should handle comment event', async () => {
        const msg = { event_type: 'comment', post_id: 'post1' };

        Post.findOneAndUpdate.mockResolvedValue({ post_id: 'post1', comment_count: 1 });
        Event.prototype.save = jest.fn().mockResolvedValue();

        await handleEvent(msg);

        expect(Event.prototype.save).toHaveBeenCalledTimes(1);
        expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
            { post_id: 'post1' },
            { $inc: { comments_count: 1 }, $set: { updatedAt: expect.any(Date) } },
            { upsert: true, new: true }
        );
    });
    it('should handle unlike event', async () => {
        const msg = { event_type: 'unlike', post_id: 'post1' };

        Post.findOneAndUpdate.mockResolvedValue({ post_id: 'post1', likes_count: 1 });
        Event.prototype.save = jest.fn().mockResolvedValue();

        await handleEvent(msg);

        expect(Event.prototype.save).toHaveBeenCalledTimes(1);
        expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
            { post_id: 'post1' },
            { $inc: { likes_count: -1 }, $set: { updatedAt: expect.any(Date) } },
            { upsert: true, new: true }
        );
    });

    it('should handle share event', async () => {
        const msg = { event_type: 'share', post_id: 'post1' };

        Post.findOneAndUpdate.mockResolvedValue({ post_id: 'post1', likes_count: 1 });
        Event.prototype.save = jest.fn().mockResolvedValue();

        await handleEvent(msg);

        expect(Event.prototype.save).toHaveBeenCalledTimes(1);
        expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
            { post_id: 'post1' },
            { $inc: { shares_count: 1 }, $set: { updatedAt: expect.any(Date) } },
            { upsert: true, new: true }
        );
    });
});
