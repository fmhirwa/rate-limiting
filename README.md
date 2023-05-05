# rate-limiting
Irembo software engineering system design assignment

# Read this first
Find developer installation guides in specific folders.
/scenario1/Readme.md
/scenario2/Readme.md
/scenario3/Readme.md

Main app.js and tests are found there as well.
Find presentation slides here:  https://docs.google.com/presentation/d/1l9nxpTLD4yv-uiv30eMUBS31OKfmo0Lxlp2i9rLYZCw/edit?usp=sharing

# Problem:
Corporation X,Y,Z offers a notification service to clients who pay for different request limits. However, the startup company has not enforced these limits in their software and is facing performance issues due to insufficient infrastructure. This affects their service quality and customer satisfaction.
Key Problems include:
Too many requests within the same time window from a client (Scenario 1)
Too many requests from a specific client on a per month basis (Scenario 2)
Too many requests across the entire system (Scenario 3)

# Solution and System Architecture
### Scenario 1
The system design uses a fixed window method and consistent hashing to limit and distribute the requests per client per hour. The method requires storing and updating a counter for each client-hour pair on the assigned server or node.

### Scenario 2
The system design uses a token bucket method and consistent hashing to limit and distribute the requests per client per month. The method requires storing and updating a bucket for each client on the assigned server or node. The bucket has a maximum size and a refill rate of tokens that determine the request limit. The code implements the token bucket algorithm using a class and a map object.

### Scenario 3
The system design uses a leaky bucket method and a shared storage to limit and distribute the requests per system per second. The method requires storing and updating a queue for the entire system on the storage. The queue has a maximum size and a drain rate of units that determine the request limit. The code uses the leaky-bucket package to implement the leaky bucket algorithm using a class and a method.


# Testing
## Brief

In this project, I implemented tests for a rate-limiting middleware using Mocha, Jest, Supertest, and Assert. I tested four scenarios: no client ID, valid client ID within limit, valid client ID exceeding limit, and valid client ID across different hours. I used helper functions to generate client IDs, get the current hour, and flush the Redis database. I used Supertest to send requests and assert responses. I used Assert to verify some test results. The tests ensure that the middleware works as expected.

## Detailed Implemetation
I used Mocha to write and run tests..

I used Supertest to make HTTP requests and check the responses. 

I used Assert to make sure the tests results are correct. Assert is a module in Node.js that has some methods to check things like if a value is true, equal to another value, an instance of a class, or throws an error.

I required these dependencies and used them in my test suite. For example, for the no client ID test, I used Supertest to send a GET request to the /test route without any client ID in the header or query. I checked that the response status code was 400 and the response body had an error message. I also used Assert to make sure the counter value in Redis was null.

For the valid client ID within limit test, I used Supertest to send multiple GET requests to the /test route with a random client ID in the header. I checked that the response status code was 200 and the response body had a success message. I also used Assert to make sure the counter value in Redis matched the number of requests sent.

For the valid client ID exceeding limit test, I used Supertest to send more than 10 GET requests to the /test route with a random client ID in the header within the same hour. I checked that the response status code was 429 and the response body had an error message. I also used Assert to make sure the counter

Received message. Here is a possible way to make it sound more human: I used Mocha to write and run my tests. Mocha lets me group my tests into suites and cases with the describe and it functions. It also lets me run some code before, after, or between tests with hooks like beforeEach and afterEach. I used Supertest to make HTTP requests and check the responses. Supertest works with any Node.js HTTP server, like Express.js. Supertest has a nice API to send requests and check things like status code, headers, body, and more. I used Assert to make sure the tests results are correct. Assert is a module in Node.js that has some methods to check things like if a value is true, equal to another value, an instance of a class, or throws an error. I required these dependencies and used them in my test suite. For example, for the no client ID test, I used Supertest to send a GET request to the /test route without any client ID in the header or query. I checked that the response status code was 400 and the response body had an error message. I also used Assert to make sure the counter value in Redis was null. For the valid client ID within limit test, I used Supertest to send multiple GET requests to the /test route with a random client ID in the header. I checked that the response status code was 200 and the response body had a success message. I also used Assert to make sure the counter value in Redis matched the number of requests sent. For the valid client ID exceeding limit test, I used Supertest to send more than 10 GET requests to the /test route with a random client ID in the header within the same hour. I checked that the response status code was 429 and the response body had an error message. I also used Assert to make sure the counter  value in Redis should be equal to 10.

The testing worked by using these dependencies and methods to verify that the rate-limiting middleware behaves as expected under different scenarios.
