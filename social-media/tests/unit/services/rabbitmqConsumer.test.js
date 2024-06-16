const { MongoClient } = require('mongodb');
const { mockDeep } = require('jest-mock-extended');
const connectRabbitMQ = require('../../../config/rabbitmq');
const { handleEvent } = require('../../../services/dbService');
jest.mock('mongodb');
jest.mock('../../../config/rabbitmq');
jest.mock('../../../services/dbService');

describe('Main script tests', () => {
    let mockChannel;
    let mockDb;
    let mockClient;
    
    beforeAll(() => {
        // Mock MongoDB Client
        mockDb = mockDeep();
        mockClient = { db: jest.fn(() => mockDb) };
        MongoClient.connect.mockImplementation((url, options, callback) => callback(null, mockClient));

        // Mock RabbitMQ Channel
        mockChannel = mockDeep();
        connectRabbitMQ.mockImplementation(callback => callback(null, mockChannel));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should connect to MongoDB and RabbitMQ, and handle events', async () => {
  
        require('../../../services/rabbitmqConsumer');

        // Ensure MongoDB connection is established
        expect(MongoClient.connect).toHaveBeenCalledWith(
            'mongodb://localhost:27017',
            { useNewUrlParser: true, useUnifiedTopology: true },
            expect.any(Function)
        );

        // Ensure RabbitMQ connection is established
        expect(connectRabbitMQ).toHaveBeenCalled();

        const msg = { content: Buffer.from(JSON.stringify({ event_type: 'like', user_id: 'user123' })) };
        await mockChannel.consume.mock.calls[0][1](msg);

        expect(handleEvent).toHaveBeenCalledWith({ event_type: 'like', user_id: 'user123' });

        expect(mockChannel.ack).toHaveBeenCalledWith(msg);
    });
});
