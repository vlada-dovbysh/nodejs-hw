# nodejs-hw

This is a Node.js project built with Express.js.

## Getting Started

First, install the project dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

The server will start on the port specified in the `.env` file.

Open your browser and go to:

```text
http://localhost:3000
```

## Environment Variables

Create a `.env` file in the root of the project and add:

```env
PORT=3000
```

Environment variables are loaded using `dotenv`.

## Available Scripts

### `npm run dev`

Runs the server in development mode using Nodemon.

The server automatically restarts when you make changes to the source files.

### `npm start`

Runs the server in production mode.

## API Routes

### Get all notes

```http
GET /notes
```

Returns:

```json
{
  "message": "Retrieved all notes"
}
```

### Get a note by ID

```http
GET /notes/:noteId
```

Example:

```http
GET /notes/123
```

Returns:

```json
{
  "message": "Retrieved note with ID: 123"
}
```

## Error Handling

The server includes custom error handling middleware.

### 404 — Route Not Found

If the requested route does not exist:

```json
{
  "message": "Route not found"
}
```

### 500 — Server Error

The `/test-error` route is used to test server error handling:

```http
GET /test-error
```

Returns:

```json
{
  "message": "Simulated server error"
}
```

## Technologies Used

* Node.js
* Express.js
* Nodemon
* dotenv
* CORS
* Pino HTTP

## Project Structure

```text
nodejs-hw/
├── src/
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Deployment

The application is deployed on Render from the `01-express` branch.

The deployed application supports the following routes:

* `GET /notes`
* `GET /notes/:noteId`
* `GET /test-error`

## Author

Vlada Dovbysh
