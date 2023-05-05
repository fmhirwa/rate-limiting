// handleRequest function attached at the bottom for testing

// Import the jest framework
import { test, expect } from 'jest';

// Import the supertest package
import request from 'supertest';

// Import the app to be tested
import app from './app.js';

// A test case for the /send endpoint
test('send endpoint should send a notification to the specified recipient', async () => {
  // Arrange
  // Define a mock request body
  const mockBody = {
    type: 'SMS',
    recipient: '+1234567890',
    message: 'Hello world'
  };
  // Define a mock client ID and API key
  const mockClientID = 'client1';
  const mockAPIKey = 'secret1';

  // Act
  // Call the /send endpoint with the mock request body and headers
  const response = await request(app)
    .post('/send')
    .set('X-Client-ID', mockClientID)
    .set('X-API-Key', mockAPIKey)
    .send(mockBody);

  // Assert
  // Expect the response status to be 200 OK
  expect(response.status).toBe(200);
  // Expect the response body to have a success property with true value
  expect(response.body).toHaveProperty('success', true);
});

// A test case for the /send endpoint with invalid request body
test('send endpoint should return an error if the request body is invalid', async () => {
  // Arrange
  // Define a mock request body with missing type field
  const mockBody = {
    recipient: '+1234567890',
    message: 'Hello world'
  };
  // Define a mock client ID and API key
  const mockClientID = 'client1';
  const mockAPIKey = 'secret1';

  // Act
  // Call the /send endpoint with the mock request body and headers
  const response = await request(app)
    .post('/send')
    .set('X-Client-ID', mockClientID)
    .set('X-API-Key', mockAPIKey)
    .send(mockBody);

  // Assert
  // Expect the response status to be 400 Bad Request
  expect(response.status).toBe(400);
  // Expect the response body to have an error property with a message
  expect(response.body).toHaveProperty('error');
});

// A test case for the /send endpoint with invalid client ID or API key
test('send endpoint should return an error if the client ID or API key is invalid', async () => {
  // Arrange
  // Define a mock request body
  const mockBody = {
    type: 'SMS',
    recipient: '+1234567890',
    message: 'Hello world'
  };
  // Define a mock client ID and API key that are not registered
  const mockClientID = 'client2';
  const mockAPIKey = 'secret2';

  // Act
  // Call the /send endpoint with the mock request body and headers
  const response = await request(app)
    .post('/send')
    .set('X-Client-ID', mockClientID)
    .set('X-API-Key', mockAPIKey)
    .send(mockBody);

  // Assert
  // Expect the response status to be 401 Unauthorized
  expect(response.status).toBe(401);
  // Expect the response body to have an error property with a message
  expect(response.body).toHaveProperty('error');
});

// A test case for the /send endpoint with exceeded rate limit
test('send endpoint should return an error if the client has exceeded their rate limit', async () => {
  // Arrange
  // Define a mock request body
  const mockBody = {
    type: 'SMS',
    recipient: '+1234567890',
    message: 'Hello world'
  };
  // Define a mock client ID and API key that have a low rate limit
  const mockClientID = 'client3';
  const mockAPIKey = 'secret3';

  // Act and Assert
// Call the /send endpoint multiple times with the same client ID and API key until an error is returned
for (let i = 0; i < 10; i++) {
    const response = await request(app)
      .post('/send')
      .set('X-Client-ID', mockClientID)
      .set('X-API-Key', mockAPIKey)
      .send(mockBody);
    
    if (i < 5) {
      // Expect the first five responses to be 200 OK
      expect(response.status).toBe(200);
      // Expect the first five responses to have a success property with true value
      expect(response.body).toHaveProperty('success', true);
    } else {
      // Expect the remaining responses to be 429 Too Many Requests
      expect(response.status).toBe(429);
      // Expect the remaining responses to have an error property with a message
      expect(response.body).toHaveProperty('error');
    }
  }
});

/* Use this handleRequest function in your code to test the code. I used the axios package, but any could do.
// Import the axios package
import axios from 'axios';

// A function that handles each request and returns a promise
function handleRequest(id) {
  // Return a promise that resolves or rejects depending on the API response
  return new Promise((resolve, reject) => {
    // Get the request details from the global queue by the id
    const request = queue[id];
    // Check the request type and call the appropriate API endpoint
    if (request.type === 'SMS') {
      // Call the SMS API endpoint with the recipient and message parameters
      axios.get(`https://mock-sms-api.com/send?recipient=${request.recipient}&message=${request.message}`)
        .then(response => {
          // Log the response data
          console.log(response.data);
          // Resolve the promise with the response data
          resolve(response.data);
        })
        .catch(error => {
          // Log the error message
          console.error(error.message);
          // Reject the promise with the error message
          reject(error.message);
        });
    } else if (request.type === 'Email') {
      // Call the Email API endpoint with the recipient and message parameters
      axios.post(`https://mock-email-api.com/send`, {
        recipient: request.recipient,
        message: request.message
      })
        .then(response => {
          // Log the response data
          console.log(response.data);
          // Resolve the promise with the response data
          resolve(response.data);
        })
        .catch(error => {
          // Log the error message
          console.error(error.message);
          // Reject the promise with the error message
          reject(error.message);
        });
    } else {
      // Reject the promise with an invalid type error message
      reject('Invalid type');
    }
  });
}
*/