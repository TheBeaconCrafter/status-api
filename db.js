const sqlite3 = require('sqlite3').verbose();
const discord = require('./discord.js');

const db = new sqlite3.Database('uptime.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database.');
        initializeTables();
    }
});

function initializeTables(callback) {
    const createTableQueries = [
        `CREATE TABLE IF NOT EXISTS domain (
            id INTEGER PRIMARY KEY,
            display_name TEXT NOT NULL,
            url TEXT NOT NULL,
            status TEXT NOT NULL,
            last_status TEXT,
            online_since TIMESTAMP,
            last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS port (
            id INTEGER PRIMARY KEY,
            display_name TEXT NOT NULL,
            url TEXT NOT NULL,
            port INTEGER NOT NULL,
            status TEXT NOT NULL,
            last_status TEXT,
            online_since TIMESTAMP,
            last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS webresponse (
            id INTEGER PRIMARY KEY,
            display_name TEXT NOT NULL,
            url TEXT NOT NULL,
            status TEXT NOT NULL,
            last_status TEXT,
            online_since TIMESTAMP,
            last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS keyword (
            id INTEGER PRIMARY KEY,
            display_name TEXT NOT NULL,
            url TEXT NOT NULL,
            keyword TEXT NOT NULL,
            status TEXT NOT NULL,
            last_status TEXT,
            online_since TIMESTAMP,
            last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    let completed = 0;
    createTableQueries.forEach((query) => {
        db.run(query, (err) => {
            if (err) console.error('Error creating table:', err);
            if (++completed === createTableQueries.length) {
                console.log('All tables initialized.');
                if (callback) callback();
            }
        });
    });
}

function saveUptime(data) {
    const { type, id, displayName, url, status, keyword, port } = data;

    const table = type.toLowerCase();
    const additionalField = type === 'keyword' ? 'keyword' : type === 'port' ? 'port' : null;

    const query = `SELECT * FROM ${table} WHERE id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Error querying database:', err);
            return;
        }

        if (row) {
            checkStatusChange(row, status, table, id, (statusChanged) => {
                const updateQuery = `
                    UPDATE ${table}
                    SET 
                        status = ?, 
                        last_status = ?, 
                        online_since = CASE 
                            WHEN ? = 'online' AND status != 'online' THEN datetime('now') 
                            ELSE online_since 
                        END, 
                        last_checked = datetime('now')
                    WHERE id = ?
                `;
                db.run(updateQuery, [status, status, status, id], (err) => {
                    if (err) console.error('Error updating record:', err);
                });
            });
        } else {
            const fields = additionalField
                ? '(id, display_name, url, ' + additionalField + ', status, last_status, online_since, last_checked)'
                : '(id, display_name, url, status, last_status, online_since, last_checked)';
            const placeholders = additionalField ? '?, ?, ?, ?, ?, datetime("now"), datetime("now")' : '?, ?, ?, ?, ?, datetime("now"), datetime("now")';
            const insertQuery = `INSERT INTO ${table} ${fields} VALUES (${placeholders})`;

            const params = additionalField
                ? [id, displayName, url, data[additionalField], status, status]
                : [id, displayName, url, status, status];

            db.run(insertQuery, params, (err) => {
                if (err) console.error('Error inserting record:', err);
            });
        }
    });
}

function checkStatusChange(row, currentStatus, table, id, callback) {
    const lastStatus = row.last_status;
    console.log(`Checking status change for ${row.display_name} (ID: ${id}): ${lastStatus} -> ${currentStatus}`);
    
    const url = row.url;
    const lastChecked = row.last_checked;

    if (currentStatus !== lastStatus) {
        console.log(`Status changed for ${row.display_name} (ID: ${id}): ${lastStatus} -> ${currentStatus}`);

        // Update both 'status' and 'last_status' immediately
        const updateStatusQuery = `
            UPDATE ${table}
            SET status = ?, last_status = ?, 
                online_since = CASE 
                    WHEN ? = 'online' AND status != 'online' THEN datetime('now') 
                    ELSE online_since 
                END,
                last_checked = datetime('now')
            WHERE id = ?
        `;
        db.run(updateStatusQuery, [currentStatus, currentStatus, currentStatus, id], (err) => {
            if (err) console.error('Error updating status:', err);
        });

        if (currentStatus === 'online') {
            discord.sendHostBackUp(row.display_name, id, url, lastChecked);  // Send back-up notification
        } else if (currentStatus === 'offline') {
            discord.sendHostDown(row.display_name, id, url, lastChecked);  // Send down notification
        } else {
            discord.sendHostUnexpectedStatus(row.display_name, id, url, lastChecked, currentStatus);  // Send unexpected status
        }

        callback(true);
    } else {
        console.log(`Status unchanged for ${row.display_name} (ID: ${id}): ${lastStatus} -> ${currentStatus}`);
        callback(false);
    }
}

function getUptime(type, id, callback) {
    const table = type.toLowerCase();
    const query = `SELECT * FROM ${table} WHERE id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Error querying database:', err);
            callback(err, null);
            return;
        }
        callback(null, row);
    });
}

function getAllHosts(callback) {
    const tables = ['domain', 'port', 'webresponse', 'keyword'];
    const results = {};

    let completed = 0;
    tables.forEach((table) => {
        const query = `SELECT * FROM ${table}`;
        db.all(query, (err, rows) => {
            if (err) {
                console.error(`Error querying table ${table}:`, err);
                callback(err, null);
                return;
            }

            results[table] = rows;
            completed++;
            if (completed === tables.length) {
                callback(null, results);
            }
        });
    });
}

// Export all config - do not modify!
const dbExports = {
    saveUptime,
    getUptime,
    initializeTables,
    getAllHosts
};
module.exports = dbExports;
