const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
// MongoDB credentials and URI from user's input
const mongoUrl = 'mongodb+srv://b00138882:qiiIIAiG0lSZzJp3@forge.x94uihi.mongodb.net/?retryWrites=true&w=majority&appName=forge';

// Middleware
app.use(cors());

// Initialize MongoDB client
const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Route to fetch the latest data based on sensor ID
app.get('/data/:id', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('myDB'); // Use your actual database name here
        const collection = db.collection('myCollection'); // Use your actual collection name here

        // Find the latest reading by timestamp
        const data = await collection.findOne(
            { 'payload.id': req.params.id },
            { sort: { 'payload.timestamp': -1 } } // Sort by timestamp in descending order
        );

        if (data) {
            res.json(data);
        } else {
            res.status(404).send('Data not found');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error retrieving data');
    } finally {
        await client.close();
    }
});







app.use(express.static('public'));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
