const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON and handle form-data
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// MySQL Connection Setup
const connection = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,   //  Correct
    user: process.env.MYSQL_ADDON_USER,   //  Correct
    password: process.env.MYSQL_ADDON_PASSWORD,  //  Correct
    database: process.env.MYSQL_ADDON_DB,   //  Correct
    port: process.env.MYSQL_ADDON_PORT,   //  Correct
    waitForConnections: true,
    queueLimit: 0
});

// Connect to MySQL Database
connection.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database as ID " + connection.threadId);
});

// Routes

// Test Route
// Get All Services (GET Request)


//users
app.get("/users", (req, res) => {
    const query = "SELECT * FROM users";

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send({ error: "Database error" });
        }

        // Send the services as the response
        res.status(200).send({ users: results });
    });
});
app.post("/users", (req, res) => {
    const { email, name, photo } = req.body;

    if (!email || !name || !photo) {
        return res.status(400).send({ error: "All fields are required" });
    }

    const query = "INSERT INTO users (email, name, photo) VALUES (?, ?, ?)";
    connection.query(query, [email, name, photo], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).send({ error: "Database error" });
        }
        res.status(201).send({ insertedId: result.insertId });
    });
});
//services
app.get("/services", (req, res) => {
    const query = "SELECT * FROM services";

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching services:", err);
            return res.status(500).send({ error: "Database error" });
        }

        // Send the services as the response
        res.status(200).send({ services: results });
    });
});
app.get("/services/related/:id", (req, res) => {
    const serviceId = req.params.id;
    const query = `
        SELECT * FROM services 
        WHERE category IN (SELECT category FROM services WHERE id = ?)
        AND id != ?`; // Exclude current service

    connection.query(query, [serviceId, serviceId], (err, results) => {
        if (err) {
            console.error("Error fetching related services:", err);
            return res.status(500).send({ error: "Database error" });
        }
        res.status(200).send({ relatedServices: results });
    });
});
app.get("/services/:id", (req, res) => {
    const serviceId = req.params.id;
    const query = "SELECT * FROM services WHERE id = ?";

    connection.query(query, [serviceId], (err, results) => {
        if (err) {
            console.error("Error fetching service:", err);
            return res.status(500).send({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).send({ message: "Service not found" });
        }

        res.status(200).send({ service: results[0] });
    });
});

app.post("/services", (req, res) => {
    const { name, image, description, category } = req.body;

    // Ensure all required fields are present
    if (!name || !image || !description || !category) {
        return res.status(400).send({ error: "All fields are required" });
    }

    // Construct the SQL query to insert the service into the database
    const query = "INSERT INTO services (name, images, description, category) VALUES (?, ?, ?, ?)";
    connection.query(query, [name, image, description, category], (err, result) => {
        if (err) {
            console.error("Error inserting service:", err); // Log the error for debugging
            return res.status(500).send({ error: "Database error" });
        }
        res.status(201).send({ insertedId: result.insertId });
    });
});

// Update Service (PATCH Request)
app.get("/services/:id", (req, res) => {
    const serviceId = req.params.id;
    const query = "SELECT * FROM services WHERE id = ?";

    connection.query(query, [serviceId], (err, results) => {
        if (err) {
            console.error("Error fetching service:", err);
            return res.status(500).send({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).send({ message: "Service not found" });
        }

        res.status(200).send({ service: results[0] });
    });
});

app.patch("/services/:id", (req, res) => {
    const { id } = req.params;
    const { name, image, description, category } = req.body;

    if (!name || !image || !description || !category) {
        return res.status(400).send({ error: "All fields are required" });
    }

    const query = `
        UPDATE services
        SET name = ?, images = ?, description = ?, category = ?
        WHERE id = ?
    `;
    connection.query(query, [name, image, description, category, id], (err, result) => {
        if (err) {
            console.error("Error updating service:", err); // Log the error for debugging
            return res.status(500).send({ error: "Database error", details: err });
        }

        console.log("Query Result:", result);  // Log result to check if the update is successful
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Service not found" });
        }

        res.status(200).send({ message: "Service updated successfully", updatedCount: result.affectedRows });
    });
});

app.delete("/services/:id", (req, res) => {
    const { id } = req.params;

    // SQL query to delete the service
    const query = "DELETE FROM services WHERE id = ?";
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting service:", err);
            return res.status(500).send({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Service not found" });
        }

        res.status(200).send({ message: "Service deleted successfully", deletedCount: result.affectedRows });
    });
});

//booked services
app.get("/bookServices", (req, res) => {
    const query = "SELECT * FROM bookservices";

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching bookservices:", err);
            return res.status(500).send({ error: "Database error" });
        }

        // Send the services as the response
        res.status(200).send({ bookservices: results });
    });
});

app.post("/bookServices", (req, res) => {
    const { email, name, images } = req.body;

    if (!email || !name || !images) {
        console.error("Validation failed:", { email, name, images });
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO bookservices (email, name, images) VALUES (?, ?, ?)";
    connection.query(query, [email, name, images], (err, result) => {
        if (err) {
            console.error("Database error:", err); // Log the exact error
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ insertedId: result.insertId });
    });
});

app.delete("/bookServices/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM bookservices WHERE id = ?";
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting booking:", err);
            return res.status(500).send({ error: "Database error" });
        }
        res.status(200).send({ message: "Booking cancelled successfully" });
    });
});

app.get("/bookServices", (req, res) => {
    const { email } = req.query; // Extract email from query parameters

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const query = "SELECT * FROM bookservices WHERE email = ?";
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error("Error fetching bookservices:", err);
            return res.status(500).json({ error: "Database error" });
        }

        res.status(200).json({ bookservices: results });
    });
});






app.get('/', (req, res) => {
    res.send('service is connected')
  })
// Add New Service (POST Request)



// Close Database Connection on App Termination
process.on("SIGINT", () => {
    connection.end((err) => {
        if (err) {
            console.error("Error during disconnection: " + err.stack);
        }
        console.log("Database connection closed");
        process.exit(0);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});