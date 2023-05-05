

# Token Bucket Algorithm

This project implements the token bucket algorithm in JavaScript, which is a rate limiting algorithm that allows a maximum number of tokens to be consumed over a specified period of time. The algorithm is commonly used in distributed systems to control the rate of traffic between different nodes.

## TokenBucket Class

The `TokenBucket` class is the main class of the project, which contains the implementation of the token bucket algorithm. It has the following properties:

* `maxSize`: the maximum number of tokens that the bucket can hold
* `refillRate`: the rate at which tokens are added to the bucket (tokens per unit of time)
* `tokens`: the current number of tokens in the bucket
* `lastRefill`: the time when the bucket was last refilled (in milliseconds since the Unix epoch)

The class has three methods:

* `constructor(maxSize, refillRate)`: creates a new `TokenBucket` object with the specified maximum size and refill rate.
* `consume()`: consumes a token from the bucket if available and returns `true`, otherwise returns `false`.
* `refill()`: refills the bucket with tokens based on the refill rate and the time elapsed since the last refill.

## Tests

The project includes a test suite for the `TokenBucket` class, which verifies the correct functionality of the algorithm. The test suite uses the Chai assertion library to perform the assertions.

The tests cover the following scenarios:

* Creating a new token bucket with the correct properties.
* Consuming tokens from the bucket and verifying the correct behavior.
* Refilling the bucket after a certain period of time and verifying the correct number of tokens.

To run the tests, use the following command:

```
npm test
```

## Conclusion

The token bucket algorithm is an effective rate limiting algorithm that can be used to control the rate of traffic in distributed systems. This solution provides a JavaScript implementation of the algorithm, along with a test suite to verify its correct functionality.