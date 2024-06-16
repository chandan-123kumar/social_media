const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const analyticsController = require('../../../controllers/analyticsController');
const Post = require('../../../models/post');
const Event = require('../../../models/event');
const ResponseTime = require('../../../models/responseTime');

jest.mock('../../../models/post');
jest.mock('../../../models/event');
jest.mock('../../../models/responseTime');

const app = express();
app.use(bodyParser.json());
app.get('/popular-post', analyticsController.getPopularPosts);
app.get('/active-user', analyticsController.getActiveUsers);
app.get('/response-time', analyticsController.getResponseTime);

describe('Analytics Controller', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('GET /popular-post', () => {

        it('should return 400 for invalid time unit', async () => {
            const response = await request(app)
                .get('/popular-post')
                .query({ unit: 'invalid' })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body.error).toBe('Invalid time unit');
        });

        it('should handle server errors', async () => {
            Post.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/popular-post')
                .query({ unit: 'hour' })
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });

    describe('GET /active-user', () => {
        it('should return active users count based on the specified time unit', async () => {
            const mockActiveUsers = [{ _id: null, count: 5 }];
            Event.aggregate.mockResolvedValue(mockActiveUsers);

            const response = await request(app)
                .get('/active-user')
                .query({ unit: 'hour' })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual(mockActiveUsers);
            expect(Event.aggregate).toHaveBeenCalledWith([
                { $match: { updatedAt: { $gte: expect.any(Date), $lte: expect.any(Date) } } },
                { $group: { _id: '$user_id' } },
                { $group: { _id: null, count: { $sum: 1 } } },
            ]);
        });

        it('should return 400 for invalid time unit', async () => {
            const response = await request(app)
                .get('/active-user')
                .query({ unit: 'invalid' })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body.error).toBe('Invalid time unit');
        });

        it('should handle server errors', async () => {
            Event.aggregate.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/active-user')
                .query({ unit: 'hour' })
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });

    describe('GET /response-time', () => {
        it('should return response times for the specified path', async () => {
            const mockResponseTimes = [
                { _id: '1', path: '/test', responseTime: 100 },
                { _id: '2', path: '/test', responseTime: 200 },
            ];
            ResponseTime.find.mockResolvedValue(mockResponseTimes);

            const response = await request(app)
                .get('/response-time')
                .query({ path: '/test' })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual(mockResponseTimes);
            expect(ResponseTime.find).toHaveBeenCalledWith({ path: '/test' });
        });

        it('should handle server errors', async () => {
            ResponseTime.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/response-time')
                .query({ path: '/test' })
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });
});
