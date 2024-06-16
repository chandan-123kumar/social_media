# High Level Diagram and basic document schema

https://github.com/chandan-123kumar/social_media/blob/main/social-media/report/diagram-and-discussion/discussion.md

# Machine local setup 
```
npm install amqplib
brew services restart rabbitmq
```
install node and mongo db on local

## Refer config folder for db and rabbitmq settings

https://github.com/chandan-123kumar/social_media/tree/main/social-media/config

go to root of project fiolder install the dependency 

```
cd root_folder_of_project
npm install
```


# start the service

```
npm run dev
```

# Testing 

Step 1
```
node automation/script.js
```
 (This will first create some dummy posts stop it after few minutes)

# In social-media/automation/test.js comment // producePost();

# uncomment start() method

Run
```
node automation/script.js
```
(This will do dummy like share login, logout etc events)

# Monitor queue
http://localhost:15672/#/queues

# Unit Test

Run
```
npm run test
```

Visit URL in the browser

file:///{your user folder}/social-media/coverage/index.html

e.g file:///Users/chandankumar/Desktop/richpanel/social-media/coverage/index.html

For ref attached screenshot here

https://github.com/chandan-123kumar/social_media/tree/main/social-media/report/unit_test_coverage

# Analytics 

## Active Users Count

http://localhost:3000/api/active-user?unit=minute

http://localhost:3000/api/active-user?unit=hour

http://localhost:3000/api/active-user?unit=day

## Popular Posts:

http://localhost:3000/api/popular-post?unit=day

http://localhost:3000/api/popular-post?unit=minute

http://localhost:3000/api/popular-post?unit=hour

## Curl command to share some post

```
curl --location 'http://localhost:3000/api/handleEvent' \
--header 'Content-Type: application/json' \
--data '{
    "user_id": "user12839348",
    "post_id": "57e96ab6-34f3-4d13-a67f-1843734bfdcb",
    "event_type": "share"
}'
```

possible value of event type
['like', 'unlike', 'share', 'comment', 'login', 'logout', 'delete_comment']

# Reports and Documentation 

## To check api responses for relevent end points check below path

https://github.com/chandan-123kumar/social_media/tree/main/social-media/report/api_response

## To see the api response time analytics check 

https://github.com/chandan-123kumar/social_media/tree/main/social-media/report/api_response_time_analytics


