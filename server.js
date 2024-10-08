const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const app = express();

app.use(cors()); // Enable CORS for all routes

// Middleware to replace curly quotes with straight quotes
app.use(bodyParser.text({ type: 'application/json' })); // Parse raw body as text

app.use((req, res, next) => {
    if (req.is('application/json')) {
        try {
            // Replace curly quotes with straight quotes
            const correctedData = req.body.replace(/[“”]/g, '"');
            req.body = JSON.parse(correctedData); // Parse the corrected JSON
            next(); // Proceed to the next middleware/route handler
        } catch (err) {
            res.status(400).json({ error: 'Invalid JSON format' });
        }
    } else {
        next(); // Proceed if not a JSON request
    }
});

// POST method to handle /bfhl
app.post('/bfhl', (req, res) => {
    const { data, file_b64, email, roll_number } = req.body;

    // Separate numbers and alphabets from data
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));

    // Find the highest lowercase alphabet
    const lowercaseAlphabets = alphabets.filter(char => /[a-z]/.test(char));
    const highestLowercaseAlphabet = lowercaseAlphabets.length
        ? [lowercaseAlphabets.sort().reverse()[0]]
        : [];

    // Handle file validity and size
    let fileValid = false;
    let mimeType = '';
    let fileSizeKB = 0;

    if (file_b64) {
        try {
            const fileBuffer = Buffer.from(file_b64, 'base64');
            mimeType = 'application/octet-stream'; // Default MIME type
            fileSizeKB = Math.round(fileBuffer.length / 1024);
            fileValid = true;
        } catch (e) {
            fileValid = false;
        }
    }

    // Respond with the required JSON structure
    res.json({
        is_success: true,
        user_id: "sharad choudhary, 10/10/2003", // Replace with actual name and date of birth
        email: email || "sharadchoudhary414@gmail.com",
        roll_number: roll_number || "RA2111003030128",
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileValid,
        file_mime_type: mimeType,
        file_size_kb: fileSizeKB
    });
});

// GET method to handle /bfhl
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
