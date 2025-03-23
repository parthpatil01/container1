const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.json());

const PV_DIR = '/parth_PV_dir';

// Endpoint to store a file
app.post('/store-file', (req, res) => {
    const { file, data } = req.body;

    if (!file || !data) {
        return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    const filePath = path.join(PV_DIR, file);

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            return res.status(500).json({ file, error: 'Error while storing the file to the storage.' });
        }
        res.json({ file, message: 'Success.' });
    });
});

// demostration of ci/cd cloud build

// Endpoint to calculate product total
app.post('/calculate', async (req, res) => {
    const { file, product } = req.body;

    if (!file || !product) {
        return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    const filePath = path.join(PV_DIR, file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ file, error: 'File not found.' });
    }

    // demonstration if ci/cd cloud build
    
    try {
        // Send request to Container 2
        const response = await axios.post('http://container2-service:5001/calculate', { file, product });
        res.json(response.data);
    } catch (error) {
        // Check if the error has a response from the server
        if (error.response) {
            // Server responded with an error status
            return res.status(error.response.status).json(error.response.data);
        } else {
            // Connection error or other issues
            return res.status(500).json({ file, error: 'Internal server error: ' + error.message });
        }
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Container 1 running on port ${PORT}`);
});