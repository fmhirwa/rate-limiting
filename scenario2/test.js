// Import the modules
const TokenBucket = require("./tokenBucket.js"); // the token bucket class
const chai = require("chai"); // the assertion library
const expect = chai.expect; // the expect function

// A test suite for the token bucket class
describe("TokenBucket", function() {
  // A test case for the constructor
  it("should create a new token bucket with the given parameters", function() {
    // Create a new token bucket with 10,000 tokens and refill rate of 10,000 per month
    let bucket = new TokenBucket(10000, 10000);

    // Check if the bucket has the correct properties
    expect(bucket).to.be.an.instanceof(TokenBucket); // the bucket should be an instance of TokenBucket
    expect(bucket.maxSize).to.equal(10000); // the bucket should have a maxSize of 10,000
    expect(bucket.refillRate).to.equal(10000); // the bucket should have a refillRate of 10,000
    expect(bucket.tokens).to.equal(10000); // the bucket should have 10,000 tokens initially
    expect(bucket.lastRefill).to.be.a("number"); // the bucket should have a lastRefill property that is a number
  });

  // A test case for the consume method
  it("should consume a token if available and return true, otherwise return false", function() {
    // Create a new token bucket with 10,000 tokens and refill rate of 10,000 per month
    let bucket = new TokenBucket(10000, 10000);

    // Consume a token and check if it returns true
    expect(bucket.consume()).to.be.true; // the bucket should return true when consuming a token

    // Check if the bucket has one less token
    expect(bucket.tokens).to.equal(9999); // the bucket should have 9,999 tokens after consuming one

    // Consume all the remaining tokens and check if it returns true each time
    for (let i = 0; i < 9999; i++) {
      expect(bucket.consume()).to.be.true; // the bucket should return true when consuming a token
    }

    // Check if the bucket has no tokens left
    expect(bucket.tokens).to.equal(0); // the bucket should have 0 tokens after consuming all

    // Try to consume another token and check if it returns false
    expect(bucket.consume()).to.be.false; // the bucket should return false when no token is available

    // Check if the bucket still has no tokens left
    expect(bucket.tokens).to.equal(0); // the bucket should still have 0 tokens after trying to consume another one
  });

  // A test case for the refill logic
  it("should refill the bucket with tokens according to the refill rate and time elapsed", function() {
    // Create a new token bucket with 10,000 tokens and refill rate of 10,000 per month
    let bucket = new TokenBucket(10000, 10000);

    // Consume all the tokens in the bucket
    for (let i = 0; i < 10000; i++) {
      bucket.consume();
    }

    // Check if the bucket has no tokens left
    expect(bucket.tokens).to.equal(0); // the bucket should have 0 tokens after consuming all

    // Mock the current time to be one month later than the last refill time
    let now = Date.now();
    let oneMonthLater = now + (1000 * 60 * 60 * 24 * 30);
    Date.now = () => oneMonthLater;

    // Try to consume a token and check if it returns true
    expect(bucket.consume()).to.be.true; // the bucket should return true when consuming a token after one month

    // Check if the bucket has been refilled with tokens according to the refill rate
    expect(bucket.tokens).to.equal(9999); // the bucket should have 9,999 tokens after refilling and consuming one

    // Check if the last refill time has been updated to the current time
    expect(bucket.lastRefill).to.equal(oneMonthLater); // the last refill time should be equal to one month later than before

    // Restore the original Date.now function
    Date.now = now;
  });
});