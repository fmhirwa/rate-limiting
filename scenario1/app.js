// Require express and redis
const express = require('express');
const redis = require('redis'); // Tested on Redis 7.0.11 Stable

// Create an express app and a redis client
const app = express();
const client = redis.createClient();

// Define the limit and the window in milliseconds
const limit = 100;
const window = 60 * 60 * 1000; // one hour

// Define a middleware function to check the rate limit
function checkRateLimit(req, res, next) {
  // Get the client id from the request header or query
  const clientId = req.header('X-Client-Id') || req.query.clientId;

  // If no client id is provided, return an error
  if (!clientId) {
    return res.status(400).send('Client id is required');
  }

  // Get the current hour as a string
  const hour = new Date().toISOString().slice(0, 13);

  // Construct the key for the counter in redis
  const key = `counter:${clientId}:${hour}`;

  // Increment the counter and get the result
  client.incr(key, (err, count) => {
    // If there is an error, return an internal server error
    if (err) {
      return res.status(500).send('Something went wrong');
    }

    // Set the expiration time for the key to one hour
    client.expire(key, window / 1000);

    // Check if the count exceeds the limit
    if (count > limit) {
      // If yes, return a too many requests error
      return res.status(429).send('Too many requests');
    }

    // If not, proceed to the next middleware or handler
    next();
  });
}

// Use the middleware for all routes
app.use(checkRateLimit);

// Define a test route to return a success message
app.get('/', (req, res) => {
  res.send('Success');
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');
});