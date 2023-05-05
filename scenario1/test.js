// Require mocha, supertest and assert
const mocha = require('mocha');
const supertest = require('supertest');
const assert = require('assert');

// Require the express app and the redis client
const app = require('./app');
const client = require('./client');

// Define the limit and the window in milliseconds
const limit = 100;
const window = 60 * 60 * 1000; // one hour

// Define a helper function to generate a random client id
function generateClientId() {
  return Math.random().toString(36).slice(2);
}

// Define a helper function to get the current hour as a string
function getCurrentHour() {
  return new Date().toISOString().slice(0, 13);
}

// Define a helper function to flush the redis database
function flushRedis(done) {
  client.flushdb(done);
}

// Define a test suite for the rate limiting middleware
mocha.describe('Rate limiting middleware', () => {
  // Before each test, flush the redis database
  mocha.beforeEach(flushRedis);

  // After all tests, flush the redis database and close the redis client
  mocha.after((done) => {
    flushRedis(() => {
      client.quit(done);
    });
  });

  // Test that a request with no client id returns an error
  mocha.it('should return an error if no client id is provided', (done) => {
    supertest(app)
      .get('/')
      .expect(400)
      .expect('Client id is required', done);
  });

  // Test that a request with a valid client id returns a success message
  mocha.it('should return a success message if a valid client id is provided', (done) => {
    const clientId = generateClientId();
    supertest(app)
      .get('/')
      .set('X-Client-Id', clientId)
      .expect(200)
      .expect('Success', done);
  });

  // Test that a request with a valid client id does not exceed the limit within the same hour
  mocha.it('should not exceed the limit within the same hour', (done) => {
    const clientId = generateClientId();
    const hour = getCurrentHour();
    const key = `counter:${clientId}:${hour}`;

    // Make limit - 1 requests with the same client id
    for (let i = 0; i < limit - 1; i++) {
      supertest(app)
        .get('/')
        .set('X-Client-Id', clientId)
        .expect(200)
        .expect('Success');
    }

    // Make one more request with the same client id and check the counter value
    supertest(app)
      .get('/')
      .set('X-Client-Id', clientId)
      .expect(200)
      .expect('Success')
      .end(() => {
        // Check that the counter value is equal to the limit
        client.get(key, (err, value) => {
          assert.equal(value, limit);
          done();
        });
      });
  });

  // Test that a request with a valid client id exceeds the limit within the same hour
  mocha.it('should exceed the limit within the same hour', (done) => {
    const clientId = generateClientId();

    // Make limit requests with the same client id
    for (let i = 0; i < limit; i++) {
      supertest(app)
        .get('/')
        .set('X-Client-Id', clientId)
        .expect(200)
        .expect('Success');
    }

    // Make one more request with the same client id and expect an error
    supertest(app)
      .get('/')
      .set('X-Client-Id', clientId)
      .expect(429)
      .expect('Too many requests', done);
  });

 // Test that a request with a valid client id does not exceed the limit across different hours
mocha.it('should not exceed the limit across different hours', (done) => {
    const clientId = generateClientId();
    const hour1 = getCurrentHour();
    const key1 = `counter:${clientId}:${hour1}`;
  
    // Make limit - 1 requests with the same client id in the first hour
    for (let i = 0; i < limit - 1; i++) {
      supertest(app)
        .get('/')
        .set('X-Client-Id', clientId)
        .expect(200)
        .expect('Success');
    }
  
    // Make one more request with the same client id and check the counter value
    supertest(app)
      .get('/')
      .set('X-Client-Id', clientId)
      .expect(200)
      .expect('Success')
      .end(() => {
        // Check that the counter value is equal to the limit
        client.get(key1, (err, value) => {
          assert.equal(value, limit);
  
          // Wait for one hour to pass
          setTimeout(() => {
            // Get the second hour as a string
            const hour2 = getCurrentHour();
            const key2 = `counter:${clientId}:${hour2}`;
  
            // Make one request with the same client id in the second hour
            supertest(app)
              .get('/')
              .set('X-Client-Id', clientId)
              .expect(200)
              .expect('Success')
              .end(() => {
                // Check that the counter value for the second hour is one
                client.get(key2, (err, value) => {
                  assert.equal(value, 1);
                  done();
                });
              });
          }, window);
        });
      });
  });
});