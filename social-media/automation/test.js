const axios = require('axios');
const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

let posts  = [];
const fetchPost = async () => {
    await axios.get('http://localhost:3000/api/popular-post?unit=day', config)
    .then(response => {
        posts = response.data;
    })
    .catch(error => {
        console.error(`Error posting event ${iteration + 1}:`, error);
    });
}
const produceRandomEvents = () => {
    const totalIterations = 1800 / 2; // 1800 seconds / 2 seconds per interval
    const activities = ['like', 'unlike', 'share', 'comment', 'login', 'logout', 'delete_comment'];


    let iteration = 0;

    
    const produceEvent = () => {
        const randomNumber = Math.floor(Math.random() * 10000);
        const index = Math.floor(Math.random() * 7);
        const postIndex = Math.floor(Math.random() * posts.length);
        let postData = {};
        if(activities[index] == 'login' || activities[index] == 'login'){
            postData = {
                user_id: `user1283${randomNumber}`,
                event_type: activities[index]
            };
        }
        else{
            postData = {
                user_id: `user1283${randomNumber}`,
                post_id: posts[postIndex].post_id,
                event_type: activities[index]
            };
        }
        const jsonData = JSON.stringify(postData);
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

const producePost = () => {
    const totalIterations = 1800 / 2; // 1800 seconds / 2 seconds per interval

    let iteration = 0;

    const createPost = () => {
        const randomNumber = Math.floor(Math.random() * 10000);
        let postData = {};
        postData = {
            user_id: `user1283${randomNumber}`,
            post_content: `This is new post ${randomNumber}`,
            event_type: 'create_post'
        };
        const jsonData = JSON.stringify(postData);
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
            setTimeout(createPost, 2000); // Schedule next event after 2 seconds
        } else {
            console.log('Event production completed.');
        }
    };
    createPost();
};

const start = async () => {
    await fetchPost();
    if (posts.length > 0) {
        produceRandomEvents();
    } else {
        console.log('No posts fetched, unable to produce events.');
    }
};
producePost();
//start();

