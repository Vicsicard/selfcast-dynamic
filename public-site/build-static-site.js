// Simple Express server to handle static site building
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public-site directory
app.use(express.static(path.join(__dirname, '..')));

// Endpoint to build a static site
app.post('/build-static-site', (req, res) => {
    const projectId = req.body.project_id;
    
    if (!projectId) {
        return res.status(400).send('Project ID is required');
    }
    
    console.log(`Building static site for project: ${projectId}`);
    
    // Execute the static-build.js script
    exec(`node static-build.js ${projectId}`, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error building static site: ${error.message}`);
            return res.status(500).send(`Error building static site: ${error.message}`);
        }
        
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        
        console.log(`stdout: ${stdout}`);
        
        // Redirect to the static site
        res.redirect(`/static-sites/${projectId}/index.html`);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`To build a static site, POST to http://localhost:${PORT}/build-static-site with project_id parameter`);
});
