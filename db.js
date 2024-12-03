const sqlite3 = require('sqlite3').verbose();

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
            const newOnlineSince = status === 'online' && row.status !== 'online' ? 'datetime("now")' : row.online_since;
        
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
            db.run(updateQuery, [status, row.status, status, id], (err) => {
                if (err) console.error('Error updating record:', err);
            });
        } else {
            const fields = additionalField
                ? '(id, display_name, url, ' + additionalField + ', status, last_status, online_since)'
                : '(id, display_name, url, status, last_status, online_since)';
            const placeholders = additionalField ? '?, ?, ?, ?, ?, ?, ?' : '?, ?, ?, ?, ?, ?';
            const insertQuery = `
                INSERT INTO ${table} ${fields}
                VALUES (${placeholders})
            `;

            const params = additionalField
                ? [id, displayName, url, data[additionalField], status, status, status === 'online' ? new Date().toISOString() : null]
                : [id, displayName, url, status, status, status === 'online' ? "datetime('now')" : null];

            db.run(insertQuery, params);
        }
    });
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

// Export all config - do not modify!
const dbExports = {
    saveUptime,
    getUptime,
    initializeTables,
};
module.exports = dbExports;
