## Notification API

The Notification API is a RESTful API that allows clients to send notifications to specified recipients via SMS, email, or push notification. The API supports authentication, rate limiting, and request validation.

### Getting Started

To get started with the Notification API, you need to have Node.js and npm installed on your machine. Clone this repository and navigate to the project directory in your terminal.

```bash
git clone https://github.com/your-username/notification-api.git
cd notification-api
```

Then install the required dependencies using npm.

```bash
npm install
```

To start the API server, run the following command:

```bash
npm start
```

The API server will start running on port 3000.

### API Endpoints

The Notification API has the following endpoints:

#### `POST /send`

This endpoint sends a notification to the specified recipient.

##### Request Body

The request body should be a JSON object with the following fields:

| Field      | Type   | Required | Description                            |
|------------|--------|----------|----------------------------------------|
| `type`     | string | Yes      | The type of notification to send.      |
| `recipient`| string | Yes      | The phone number or email of the recipient. |
| `message`  | string | Yes      | The message to send to the recipient.   |

Example request body:

```json
{
  "type": "SMS",
  "recipient": "+1234567890",
  "message": "Hello world"
}
```

##### Request Headers

The following headers are required for authentication:

| Header      | Value  | Required | Description                            |
|-------------|--------|----------|----------------------------------------|
| `X-Client-ID` | string | Yes      | The ID of the client. |
| `X-API-Key`  | string | Yes      | The API key of the client.   |

##### Response Body

The response body will be a JSON object with the following fields:

| Field      | Type    | Description                             |
|------------|---------|-----------------------------------------|
| `success`  | boolean | `true` if the notification was sent successfully, `false` otherwise. |
| `error`    | string  | The error message, if any.              |

Example success response:

```json
{
  "success": true
}
```

Example error response:

```json
{
  "error": "Invalid request body."
}
```

#### `POST /auth`

This endpoint authenticates the client and generates an API key.

##### Request Body

The request body should be a JSON object with the following fields:

| Field      | Type   | Required | Description                            |
|------------|--------|----------|----------------------------------------|
| `name`     | string | Yes      | The name of the client.                |
| `email`    | string | Yes      | The email of the client.               |

Example request body:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

##### Response Body

The response body will be a JSON object with the following fields:

| Field      | Type   | Description                            |
|------------|--------|----------------------------------------|
| `clientID` | string | The ID of the client.                  |
| `apiKey`   | string | The API key of the client.              |

Example response:

```json
{
  "clientID": "client1",
  "apiKey": "secret1"
}
```

### Testing

To run the tests, use the following command:

```bash
npm test
```

This will run the automated tests using the Jest framework and the supertest package.
