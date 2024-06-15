const axios = require('axios');
const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};
const produceRandomEvents = () => {
    const totalIterations = 1800 / 2; // 1800 seconds / 2 seconds per interval
    const activities = ['like', 'unlike', 'share'];


    let iteration = 0;

    const produceEvent = () => {
        const randomNumber = Math.floor(Math.random() * 10000);
        const index = Math.floor(Math.random() * 3);
        const postData = {
            user_id: `user1283${randomNumber}`,
            post_id: 'dc3fb08c-e347-4357-aa5a-c15c0acd6d16',
            event_type: activities[index]
        };
        const jsonData = JSON.stringify(postData);
        console.log(jsonData);
        // Post the event data
        axios.post('http://localhost:3000/api/handleEvent', jsonData, config)
            .then(response => {
                console.log(`Event ${iteration + 1} posted successfully`);
            })
            .catch(error => {
                console.error(`Error posting event ${iteration + 1}:`, error);
            });

        iteration++;
        console.log(`Scheduled event ${iteration}`);

        // Check if all iterations are complete
        if (iteration < totalIterations) {
            setTimeout(produceEvent, 2000); // Schedule next event after 2 seconds
        } else {
            console.log('Event production completed.');
        }
    };

    // Start producing events
    produceEvent();
};
produceRandomEvents();
