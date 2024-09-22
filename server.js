const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import CORS middleware
const app = express();

app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json()); // Middleware for parsing JSON requests

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
        user_id: "your_name_ddmmyyyy", // Replace with actual name and date of birth
        email: email || "default_email@example.com",
        roll_number: roll_number || "default_roll_number",
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
    console.log(`Server running on port ${PORT}`); // Correct template literal usage
});
