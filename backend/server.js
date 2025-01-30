const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 4000; // Use environment port for Render

// MongoDB connection details
const homeUri = "mongodb+srv://Dhruveshshyara16:Dhruvesh1611@cluster1.mi6ov.mongodb.net/home_page?retryWrites=true&w=majority";
const usersUri = "mongodb+srv://Dhruveshshyara16:Dhruvesh1611@cluster1.mi6ov.mongodb.net/users_collection?retryWrites=true&w=majority";

let homeDb, bestSellingItems, editorials;
let usersDb, usersDesignData;

// Initialize MongoDB for both databases
async function initializeDatabases() {
    try {
        // Connect to Home Page DB
        const homeClient = await MongoClient.connect(homeUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to Home Page MongoDB");
        homeDb = homeClient.db("home_page");
        bestSellingItems = homeDb.collection("best_selling_items");
        editorials = homeDb.collection("editorials");

        // Connect to Users Collection DB
        const usersClient = await MongoClient.connect(usersUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to Users Collection MongoDB");
        usersDb = usersClient.db("users_collection");
        usersDesignData = usersDb.collection("users_design_data");

        // Start server after DB connections
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

initializeDatabases();

// Middleware
app.use(express.json());

// Home Page Routes
app.get('/best_selling_items', async (req, res) => {
    try {
        const items = await bestSellingItems.find().toArray();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).send("Error fetching items: " + err.message);
    }
});

app.get('/editorials', async (req, res) => {
    try {
        const editorialData = await editorials.find().toArray();
        res.status(200).json(editorialData);
    } catch (err) {
        res.status(500).send("Error fetching editorials: " + err.message);
    }
});

// Users Collection Routes
app.get('/users_design_data', async (req, res) => {
    try {
        const users = await usersDesignData.find().toArray();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});
