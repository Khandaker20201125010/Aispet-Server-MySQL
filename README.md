# Express MySQL Server

This project is an Express.js server application integrated with a MySQL database. It includes various endpoints for managing users, services, and bookings. Below is a step-by-step guide explaining the code and setup process.

## Prerequisites

Make sure you have the following installed:

1. **Node.js**: [Download Node.js](https://nodejs.org/)
2. **XAMPP**: [Download XAMPP](https://www.apachefriends.org/) To run MYSQL
3. **npm**: Comes with Node.js installation.
4. **Git**: [Download Git](https://git-scm.com/downloads)

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file**:
   Add the following variables to your `.env` file:
   ```env
   PORT=5000
   HOST=localhost
   USER_NAME=<your-mysql-username>
   USER_PASS=<your-mysql-password>
   DATABASE=<your-database-name>
   DB_PORT=3306
   ```

4. **Set up the MySQL database**:
   - Create a new database in MySQL.
   - Use the following SQL commands to create tables:
     ```sql
     CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) NOT NULL,
       name VARCHAR(255) NOT NULL,
       photo VARCHAR(255) NOT NULL
     );

     CREATE TABLE services (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       images VARCHAR(255) NOT NULL,
       description TEXT NOT NULL,
       category VARCHAR(255) NOT NULL
     );

     CREATE TABLE bookservices (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) NOT NULL,
       name VARCHAR(255) NOT NULL,
       images VARCHAR(255) NOT NULL
     );
     ```

5. **Start the server**:
   ```bash
   npm start
   ```

## Explanation of Code

### Dependencies
```javascript
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql");
const bodyParser = require("body-parser");
```
- **express**: Web framework for Node.js.
- **cors**: Enables Cross-Origin Resource Sharing.
- **dotenv**: Loads environment variables from a `.env` file.
- **mysql**: MySQL client for Node.js.
- **body-parser**: Middleware to parse incoming request bodies.

### Middleware
```javascript
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
```
- **cors()**: Allows requests from other origins.
- **express.json()**: Parses JSON request bodies.
- **bodyParser.urlencoded()**: Parses URL-encoded request bodies.

### MySQL Connection
```javascript
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.USER_PASS,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database as ID " + connection.threadId);
});
```
- Establishes a connection to the MySQL database using environment variables.
- Handles connection errors gracefully.

### Routes

#### Users
- **GET /users**: Fetch all users from the database.
- **POST /users**: Add a new user to the database.

#### Services
- **GET /services**: Fetch all services.
- **GET /services/:id**: Fetch a specific service by ID.
- **GET /services/related/:id**: Fetch services in the same category as a given service.
- **POST /services**: Add a new service.
- **PATCH /services/:id**: Update a service.
- **DELETE /services/:id**: Delete a service.

#### Booked Services
- **GET /bookServices**: Fetch all bookings.
- **POST /bookServices**: Add a new booking.
- **DELETE /bookServices/:id**: Delete a booking.

### Root Route
```javascript
app.get("/", (req, res) => {
    if (connection.state !== "connected") {
        return res.status(500).send("Database is not connected");
    }
    res.send("Hello from the server!");
});
```
- Responds with a success message if the server and database are running.

### Graceful Shutdown
```javascript
process.on("SIGINT", () => {
    connection.end((err) => {
        if (err) {
            console.error("Error during disconnection: " + err.stack);
        }
        console.log("Database connection closed");
        process.exit(0);
    });
});
```
- Ensures the database connection is closed when the server is stopped.

### Start the Server
```javascript
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
```
- Starts the server on the specified port.

## Testing

1. **Using Postman or cURL**:
   - Test each endpoint to ensure proper functionality.

2. **Example cURL commands**:
   - Fetch all users:
     ```bash
     curl -X GET http://localhost:5000/users
     ```
   - Add a new service:
     ```bash
     curl -X POST http://localhost:5000/services -H "Content-Type: application/json" -d '{"name":"Service1","image":"image_url","description":"Service description","category":"Category1"}'
     ```

## Folder Structure
```
.
├── server.js          # Main server file
├── package.json       # Project dependencies
├── .env               # Environment variables
└── README.md          # Documentation
```

## Troubleshooting
- **Database connection errors**:
  - Ensure your `.env` file contains correct credentials.
  - Verify MySQL server is running.
- **Port conflicts**:
  - Ensure no other application is using the specified port.

## Conclusion
This project demonstrates a robust Express.js server with MySQL integration. Follow the steps above to set it up and extend it as needed.
# Guide to Deploying Your Server to Vercel

This guide explains how to make your server live on Vercel. It covers installation, configuration, and deployment steps.

---

## Prerequisites
1. **Node.js** installed on your system.
   - Check with:
     ```bash
     node -v
     ```
   - If not installed, download it from [Node.js Official Website](https://nodejs.org/).

2. **Vercel Account**:
   - Sign up at [Vercel](https://vercel.com/) if you don't already have an account.

3. **Project Requirements**:
   - Ensure your server project has a valid `package.json` file.
   - Your server code should have a proper entry point (e.g., `index.js`).

---

## Step 1: Install Vercel CLI
1. Open your terminal and install Vercel globally using npm:
   ```bash
   npm install -g vercel
   ```

2. Verify the installation:
   ```bash
   vercel --version
   ```

3. Log in to Vercel:
   ```bash
   vercel login
   ```
   Follow the prompts to authenticate your account.

---

## Step 2: Prepare Your Project
1. **Create or Navigate to Your Project**:
   - Ensure your project folder contains the server code and a valid `package.json` file.

2. **Set Your Start Script**:
   - In `package.json`, add a start script to define how your server runs:
     ```json
     "scripts": {
       "start": "node index.js"
     }
     ```
3. **Make file name vercel.json 
   add a start script to define how your server runs:
    ```{
    "version": 2,
    "builds": [
      {
        "src": "index.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "index.js",
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
      }
    ]
  } 
```
4. **Test Your Server Locally**:
   - Run your server locally to ensure it works as expected:
     ```bash
     npm start
     ```

---

## Step 3: Deploy to Vercel
1. Navigate to your project directory:
   ```bash
   cd /path/to/your/project
   ```

2. Run the deployment command:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - **Project name**: Enter your project name or press Enter to use the folder name.
   - **Link to existing project**: If you’ve deployed this project before, link it. Otherwise, select "No."
   - **Detected framework**: Vercel will detect your project type (Node.js). Confirm the selection.
   - **Override settings**: Choose "No" unless you need custom configurations.

4. Once deployed, Vercel will provide a URL where your server is live. Example:
   ```
   https://your-project-name.vercel.app
   ```

---

## Step 4: Environment Variables (Optional)
1. If your project requires environment variables:
   - Go to the [Vercel Dashboard](https://vercel.com/dashboard).
   - Select your project.
   - Navigate to **Settings > Environment Variables**.
   - Add your variables (e.g., `DATABASE_URL`, `API_KEY`).

2. Redeploy your project to apply the changes:
   ```bash
   vercel --prod
   ```

---

## Step 5: Test Your Live Server
1. Visit the provided URL to test your server.
2. Use tools like Postman or your frontend app to ensure the endpoints are working correctly.

---

## Step 6: Update and Redeploy
1. Make changes to your server code as needed.
2. Deploy updates:
   ```bash
   vercel --prod
   ```

---

## Troubleshooting
- **Server Not Working**:
  - Check logs in the Vercel Dashboard under **Functions**.
  - Ensure all environment variables are correctly set.

- **Port Binding Error**:
  - Vercel dynamically assigns a port. Use:
    ```javascript
    const port = process.env.PORT || 3000;
    ```

---

Your server is now live and ready to use on Vercel!



