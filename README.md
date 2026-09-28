# ICSI418Y_PA2

Programming Assignment 2 for ICSI 418Y Software Engineering.

## Description

This project is a simple full-stack signup and login application built with React, Node.js, Express, and MongoDB.

The application allows a user to create a new account with a first name, last name, username, and password. The user information is stored in a MongoDB database.

Existing users can also log in with their username and password. The application provides feedback for successful and unsuccessful signup and login attempts.

## Features

### Signup

- Create a new user with:
  - First Name
  - Last Name
  - Username
  - Password
- Check that all required fields are provided
- Prevent duplicate usernames
- Store new users in MongoDB
- Display success or error feedback to the user

### Login

- Log in with a username and password
- Check that both fields are provided
- Check whether the username exists
- Check whether the password matches the stored password
- Display success or error feedback to the user

## Technologies

### Frontend

- React
- JavaScript
- Vite
- CSS

### Backend

- Node.js
- Express
- MongoDB
- CORS
- dotenv

### Database

- MongoDB Atlas
- Database: `pa2`
- Collection: `users`

## Project Structure

```text
ICSI418Y_PA2/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Signup.jsx
│   │   ├── Login.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── index.html
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

The `client` directory contains the React frontend, while the `server` directory contains the Express backend and MongoDB connection.

The `.env` file is stored locally and is excluded from Git.

## How to Run

### 1. Clone the Repository

Clone the repository and enter the project directory.

```bash
git clone <repository-url>
cd ICSI418Y_PA2
```

### 2. Configure MongoDB

Create a `.env` file inside the `server` directory:

```text
MONGO_URI=your_mongodb_connection_string
```

The actual MongoDB connection string should not be committed to GitHub.

### 3. Start the Backend

Open a terminal in the project directory and run:

```bash
cd server
npm install
node server.js
```

The backend server runs on:

```text
http://localhost:9000
```

When the server successfully connects to MongoDB, the terminal should display messages indicating that the server is running and MongoDB is connected.

### 4. Start the Frontend

Open another terminal in the project directory and run:

```bash
cd client
npm install
npm run dev
```

Vite will provide a local URL for the React application. Open that URL in a browser to use the application.

## Application Flow

The application follows a simple full-stack structure:

```text
React Frontend
      |
      | HTTP POST Requests
      v
Express Backend
      |
      | MongoDB Operations
      v
MongoDB Atlas
```

For signup, the React frontend sends the user's first name, last name, username, and password to the `/signup` endpoint. The backend validates the data, checks for an existing username, and inserts a new user into MongoDB when the username is available.

For login, the React frontend sends the username and password to the `/login` endpoint. The backend finds the user in MongoDB and checks whether the submitted password matches the stored password.

The backend then sends a JSON response to the frontend, and React displays the corresponding success or error message.

## API Endpoints

### `POST /signup`

Creates a new user.

Possible responses include:

- `201` - User created successfully
- `400` - Required fields are missing
- `409` - Username already exists
- `500` - Server or database error

### `POST /login`

Checks an existing user's credentials.

Possible responses include:

- `200` - Login successful
- `400` - Required fields are missing
- `401` - Invalid username or password
- `500` - Server or database error

## Notes

- MongoDB automatically generates the `_id` field for each new user.
- The MongoDB connection string is stored in `server/.env`.
- The `.env` file and `node_modules` directories are excluded from Git and are not included in the repository.
- This assignment only requires the application to acknowledge a successful login. It does not implement sessions or authentication tokens.