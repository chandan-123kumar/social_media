const request = require('supertest');
const express = require('express');
const eventController = require('../../../controllers/eventController')
const postControllerAnalytics = require('../../../controllers/analyticsController');
const router = require('../../../routes/appRoutes');

jest.mock('../../../controllers/eventController');
jest.mock('../../../controllers/analyticsController');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Test the routes', () => {

    it('should handle POST /handleEvent', async () => {
        eventController.handleEvent.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Event handled and sent to queue' });
        });

        const response = await request(app)
            .post('/handleEvent')
            .send({ user_id: 'user1', event_type: 'like' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Event handled and sent to queue');
    });

    it('should handle GET /popular-post', async () => {
        postControllerAnalytics.getPopularPosts.mockImplementation((req, res) => {
            res.status(200).json([{ post_id: 'post1', likes_count: 10 }]);
        });

        const response = await request(app)
            .get('/popular-post')
            .query({ unit: 'hour' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ post_id: 'post1', likes_count: 10 }]);
    });

    it('should handle GET /active-user', async () => {
        postControllerAnalytics.getActiveUsers.mockImplementation((req, res) => {
            res.status(200).json([{ user_id: 'user1' }]);
        });

        const response = await request(app)
            .get('/active-user')
            .query({ unit: 'hour' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ user_id: 'user1' }]);
    });

    it('should handle GET /response-time', async () => {
        postControllerAnalytics.getResponseTime.mockImplementation((req, res) => {
            res.status(200).json({ average_response_time: 123 });
        });

        const response = await request(app)
            .get('/response-time');

        expect(response.status).toBe(200);
        expect(response.body.average_response_time).toBe(123);
    });
});
