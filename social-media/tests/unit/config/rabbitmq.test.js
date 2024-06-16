const amqp = require('amqplib/callback_api');
const connectRabbitMQ = require('../../../config/rabbitmq');

jest.mock('amqplib/callback_api');

describe('RabbitMQ Connection', () => {
  let mockConnect, mockCreateChannel;

  beforeEach(() => {
    mockCreateChannel = jest.fn().mockImplementation((callback) => {
      callback(null, 'mockChannel');
    });

    mockConnect = jest.fn().mockImplementation((url, callback) => {
      callback(null, {
        createChannel: mockCreateChannel,
      });
    });

    amqp.connect.mockImplementation(mockConnect);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new channel if not already created', (done) => {
    connectRabbitMQ((err, channel) => {
      expect(err).toBeNull();
      expect(channel).toBe('mockChannel');
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockCreateChannel).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
