API gathers data from the Glassdoor website.
Submit glassdoor credentials.

{
"email": "",
"password": ""
}

The API should take in a request with the credentials and gather the data. Also there
should be a way to store and retrieve the data after it has been gathered.

What would you need to do on the website:
Log in into the website with the provided credentials. Have a way of handling wrong
credentials.
Download the resume pdf that is present in the profile and store it on the server.
Scrape the user profile data. Log out of the website.

'/api/cv' logs in,gets the resume, and
'/api/job/:id' checks JOB processing status
'/api/cv/:id' gets CV data in JSON format

# Install

npm i

Copy .env file to root folder.

# Run

npm start

# Test

Some unit tests are done. To execute tests enter.

npm test

# MongoDB Database Access

MongoDB database is setup in Mongo cloud. Access it to view the data about jobs and resumes.

# Job queue

Requests will go into Agenda mongodb based queue. Failed jobs will be retried 4 times. Mongo database collection jobs will show jobs that failed. Successful jobs will be deleted from the database.

# APIS

Documentation and testing of apis can be accessed at localhost:8080/api-docs
Click on Authorize and add the apiKey (1234) to authorize requests. Click on try and execute for each API request to test the APIs. All API requests and responses are described using swagger docs.
