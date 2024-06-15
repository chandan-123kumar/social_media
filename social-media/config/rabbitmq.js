const amqp = require('amqplib/callback_api');

const username = 'test';
const password = 'test';
const host = 'localhost';
const port = '5672';
const vhost = '/';

const connectionURL = `amqp://${username}:${password}@${host}:${port}${vhost}`;

let channel = null;

const connectRabbitMQ = (callback) => {
  if (channel) {
    return callback(null, channel);
  }

  amqp.connect(connectionURL, (error0, connection) => {
    if (error0) {
      return callback(error0);
    }

    connection.createChannel((error1, ch) => {
      if (error1) {
        return callback(error1);
      }

      channel = ch;
      callback(null, channel);
    });
  });
};

module.exports = connectRabbitMQ;
