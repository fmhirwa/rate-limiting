// Import the leaky-bucket package
import LeakyBucket from 'leaky-bucket';

// Create a bucket with a capacity of 1000 requests per second and a timeout of 10 seconds
const bucket = new LeakyBucket({
  capacity: 1000,
  interval: 1,
  timeout: 10
});

// A function that simulates a request
function request() {
  // Generate a random request ID
  const id = Math.floor(Math.random() * 1000000);
  // Log the request ID and time
  console.log(`Request ${id} at ${new Date().toISOString()}`);
  // Try to throttle the request using the bucket
  return bucket.throttle(() => handleRequest(id));
}

// A function that simulates handling a request
function handleRequest(id) {
  // Return a promise that resolves after a random delay between 0 and 5 seconds
  return new Promise(resolve => {
    const delay = Math.floor(Math.random() * 5000);
    setTimeout(() => {
      // Log the response ID and time
      console.log(`Response ${id} at ${new Date().toISOString()}`);
      resolve();
    }, delay);
  });
}

// A loop that generates requests every 10 milliseconds
setInterval(request, 10);