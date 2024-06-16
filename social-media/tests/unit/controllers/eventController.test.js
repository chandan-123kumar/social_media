const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const connectRabbitMQ = require('../../../config/rabbitmq');
const eventController = require('../../../controllers/eventController');

jest.mock('../../../config/rabbitmq');

const app = express();
app.use(bodyParser.json());
app.post('/handleEvent', eventController.handleEvent);

describe('POST /handleEvent', () => {
  it('should handle the event and send to queue successfully', async () => {
    const mockChannel = {
      assertQueue: jest.fn((queue, options, callback) => callback && callback()),
      sendToQueue: jest.fn(),
    };
    connectRabbitMQ.mockImplementation((callback) => {
      callback(null, mockChannel);
    });

    const event = {
      user_id: 'test_user',
      post_id: 'test_post',
      event_type: 'like',
    };

    const response = await request(app)
      .post('/handleEvent')
      .send(event)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.message).toBe('Event handled and sent to queue');
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('event', { durable: true });
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      'event',
      Buffer.from(JSON.stringify(event)),
      { persistent: true }
    );
  });

  it('should return 500 if there is an error connecting to RabbitMQ', async () => {
    const errorMessage = 'Connection error';
    connectRabbitMQ.mockImplementation((callback) => {
      callback(new Error(errorMessage));
    });

    const event = {
      user_id: 'test_user',
      post_id: 'test_post',
      event_type: 'like',
    };

    const response = await request(app)
      .post('/handleEvent')
      .send(event)
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body.error).toBe(errorMessage);
  });
});
