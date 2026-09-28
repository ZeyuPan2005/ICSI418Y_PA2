// dotenv loads .env values into process.env so the private MONGO_URI stays out of source code.
require("dotenv").config();

// Express handles HTTP requests and responses; cors supplies browser cross-origin permissions.
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
// MongoClient manages the database connection using the URI loaded from .env.
const client = new MongoClient(process.env.MONGO_URI);
// pa2 is the database; users is its collection of user documents (records).
const users = client.db("pa2").collection("users");

async function connectDatabase() {
    try {
        // Connecting takes time; await waits for it without blocking other JavaScript work.
        await client.connect();
        console.log("Connected to MongoDB");
    } catch {
        // Keep connection details private by logging only a general failure message.
        console.error("Could not connect to MongoDB");
    }
}

connectDatabase();

// Middleware runs before the routes. This parses incoming JSON into req.body.
app.use(express.json());
// Ports 5173 and 9000 are different origins, so React needs CORS permission to read responses.
app.use(cors());

// A route pairs an HTTP method and URL path with a handler.
// req contains the incoming request; res is used to send the response back to the caller.
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

// React's fetch("http://localhost:9000/signup", ...) reaches this POST route.
app.post("/signup", async (req, res) => {
    // express.json() makes React's JSON fields available here; {} handles an absent body.
    const { f_name, l_name, username, password } = req.body || {};

    if (
        // Browser checks can be bypassed (our forms also use noValidate), so validate on the server.
        // Require strings and reject blank/whitespace-only values before querying MongoDB.
        typeof f_name !== "string" || !f_name.trim() ||
        typeof l_name !== "string" || !l_name.trim() ||
        typeof username !== "string" || !username.trim() ||
        typeof password !== "string" || !password.trim()
    ) {
        // 400 means bad input. return stops this handler so it cannot continue or send a second reply.
        return res.status(400).json({ message: "Please provide first name, last name, username, and password." });
    }

    try {
        // findOne returns one matching document, or null; await waits for the database result.
        const existingUser = await users.findOne({ username });

        if (existingUser) {
            // 409 means the requested username conflicts with an existing account.
            return res.status(409).json({ message: "That username is already taken." });
        }

        // insertOne stores a new document; MongoDB generates _id because we do not supply one.
        await users.insertOne({ f_name, l_name, username, password });
        // 201 means a resource was created; send success only after the insert completes.
        return res.status(201).json({ message: "Signup successful! You can now log in." });
    } catch {
        // try/catch handles database failures; 500 means a server error, not invalid user input.
        // A general message gives React feedback without exposing private database details.
        return res.status(500).json({ message: "A server error occurred. Please try again later." });
    }
});

// React's /login fetch reaches this route to check credentials, without inserting a user.
app.post("/login", async (req, res) => {
    // Login receives just these two JSON fields and validates them before using the database.
    const { username, password } = req.body || {};

    if (
        typeof username !== "string" || !username.trim() ||
        typeof password !== "string" || !password.trim()
    ) {
        return res.status(400).json({ message: "Please provide username and password." });
    }

    try {
        // Retrieve the stored user so the submitted password can be compared with its password.
        const user = await users.findOne({ username });

        // Check for a missing user first so we never read password from null.
        // 401 means invalid credentials; both failure cases use the same response.
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // 200 acknowledges a successful check; React displays this message to the user.
        return res.status(200).json({ message: "Login successful!" });
    } catch {
        // try/catch handles database failures; 500 means a server error, not invalid user input.
        // A general message gives React feedback without exposing private database details.
        return res.status(500).json({ message: "A server error occurred. Please try again later." });
    }
});

// Listen on the same port used in the React fetch URLs.
app.listen(9000, () => {
    console.log("Server running on port 9000");
});
