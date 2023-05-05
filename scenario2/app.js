// A class to represent a token bucket
class TokenBucket {
    constructor(maxSize, refillRate) {
      this.maxSize = maxSize; // the maximum size of the bucket
      this.refillRate = refillRate; // the number of tokens to add per month
      this.tokens = maxSize; // the current number of tokens in the bucket
      this.lastRefill = Date.now(); // the last time the bucket was refilled
    }
  
    // A method to check if there is a token available and consume it
    consume() {
      // Refill the bucket if it's a new month
      let now = Date.now();
      let monthDiff = Math.floor((now - this.lastRefill) / (1000 * 60 * 60 * 24 * 30));
      if (monthDiff > 0) {
        this.tokens = Math.min(this.maxSize, this.tokens + monthDiff * this.refillRate);
        this.lastRefill = now;
      }
  
      // Check if there is a token available
      if (this.tokens > 0) {
        // Consume a token and return true
        this.tokens--;
        return true;
      } else {
        // No token available, return false
        return false;
      }
    }
  }
  
  // A map to store the buckets for each client
  let buckets = new Map();
  
  // A function to handle requests from clients
  function handleRequest(clientId) {
    // Get or create the bucket for the client
    let bucket = buckets.get(clientId);
    if (!bucket) {
      bucket = new TokenBucket(10000, 10000); // create a new bucket with 10,000 tokens and refill rate of 10,000 per month
      buckets.set(clientId, bucket); // store the bucket in the map
    }
  
    // Check if the bucket can consume a token
    if (bucket.consume()) {
      // Token available, process the request and send a response
      console.log("Request accepted from client " + clientId);
      // Do some work here ...
      // Send a response here ...
    } else {
      // No token available, reject the request and send an error response
      console.log("Request rejected from client " + clientId);
      // Send an error response here ...
    }
  }