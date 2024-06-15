npm install amqplib

brew services restart rabbitmq



#Testing 

node social-media/automation/test.js (This will do dummy like share login, logout etc events)

Analytics 
Active Users Count
http://localhost:3000/api/active-user?unit=minute
http://localhost:3000/api/active-user?unit=hour
http://localhost:3000/api/active-user?unit=day