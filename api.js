const express = require('express');
const app = express();
const port = 3593;
const pinger = require('./pinger.js');
const db = require('./db.js');

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/domain/:id', (req, res) => {
    db.getUptime('domain', 1, (err, data) => {
        if (err) {
            console.error('Error retrieving uptime:', err);
            res.send('Error retrieving uptime');
        } else {
            console.log('Uptime data:', data);
            res.send(data);
        }
    });
});

// Export all config - do not modify!
const apiExports = {
    app,
    port,
};
module.exports = apiExports;