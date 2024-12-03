const express = require('express');
const app = express();
const port = 3593;
const pinger = require('./pinger.js');
const db = require('./db.js');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

app.use(limiter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/domain/:id', (req, res) => {
    db.getUptime('domain', req.params.id, (err, data) => {
        if (err) {
            console.error('Error retrieving uptime:', err);
            res.send('Error retrieving uptime');
        } else {
            res.send(data);
        }
    });
});

app.get('/webresponse/:id', (req, res) => {
    db.getUptime('webresponse', req.params.id, (err, data) => {
        if (err) {
            console.error('Error retrieving uptime:', err);
            res.send('Error retrieving uptime');
        } else {
            res.send(data);
        }
    });
});

app.get('/keyword/:id', (req, res) => {
    db.getUptime('keyword', req.params.id, (err, data) => {
        if (err) {
            console.error('Error retrieving uptime:', err);
            res.send('Error retrieving uptime');
        } else {
            res.send(data);
        }
    });
});

app.get('/port/:id', (req, res) => {
    db.getUptime('port', req.params.id, (err, data) => {
        if (err) {
            console.error('Error retrieving uptime:', err);
            res.send('Error retrieving uptime');
        } else {
            res.send(data);
        }
    });
});

app.get('/hosts', (req, res) => {
    db.getAllHosts((err, data) => {
        if (err) {
            console.error('Error fetching all hosts:', err);
            res.send('Error fetching all hosts');
        } else {
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