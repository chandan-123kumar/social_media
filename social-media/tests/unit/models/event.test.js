const mongoose = require('mongoose');
const Event = require('../../../models/event');

describe('Event Model', () => {
    // Before all tests, connect to a test database
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Test case for saving an Event
    it('should correctly save an Event', async () => {
        const eventData = {
            event_id: 'event123',
            user_id: 'user456',
            event_type: 'like',
            metadata: {}
        };
        

        const event = new Event({
        event_id: 'event123',
        user_id: 'user456',
        event_type: 'like',
        metadata: {}});
        const savedEvent = await validEvent.save();
        expect(savedEvent._id).toBeDefined();
        expect(savedEvent.event_id).toBe(eventData.event_id);
        expect(savedEvent.user_id).toBe(eventData.user_id);
        expect(savedEvent.event_type).toBe(eventData.event_type);
        expect(savedEvent.metadata).toEqual(eventData.metadata);
    });

    // Test case for handling validation errors
    it('should throw a validation error when required fields are missing', async () => {
        const eventData = {
            user_id: 'user789',
            event_type: 'comment',
            metadata: { text: 'A comment' }
        };

        const eventWithoutRequiredField = new Event(eventData);

        let error;
        try {
            await eventWithoutRequiredField.validate();
        } catch (err) {
            error = err;
        }

        // Expect a validation error due to missing event_id field
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error.errors.event_id).toBeDefined();
    });
});
