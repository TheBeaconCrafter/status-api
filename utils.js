const ping = require('ping');
const net = require('net');
const axios = require('axios');
const db = require('./db');

const checkDomain = async (domain, name, id) => {
    let status = '';
    try {
        const res = await ping.promise.probe(domain);
        if (res.alive) {
            console.log(`${domain} is online`);
            status = 'online';
        } else {
            console.log(`${domain} is offline`);
            status = 'offline';
        }
    } catch (error) {
        console.error(error);
        status = 'offline';
    }
    db.saveUptime({
        type: 'domain',
        id: id,
        displayName: name,
        url: domain,
        status: status,
    });
};

const checkPort = async (host, port, name, id) => {
    const socket = net.Socket();
    let status = '';

    // Return a Promise to ensure the function doesn't exit early
    const checkPortStatus = new Promise((resolve) => {
        socket.setTimeout(3000);
        socket.connect(port, host, () => {
            console.log(`${host}:${port} is online`);
            status = 'online';
            socket.end();
            resolve(status);
        });

        socket.on('error', (err) => {
            console.log(`${host}:${port} is offline`);
            socket.destroy();
            status = 'offline';
            resolve(status);
        });

        socket.on('timeout', () => {
            console.log(`${host}:${port} timed out`);
            status = 'timeout';
            socket.destroy();
            resolve(status);
        });
    });

    const resolvedStatus = await checkPortStatus;

    db.saveUptime({
        type: 'port',
        port: port,
        id: id,
        displayName: name,
        url: host,
        status: resolvedStatus,
    });
};

const checkWebResponse = async (url, name, id) => {
    let status = '';

    try {
        const res = await axios.get(url);
        if (res.status >= 200 && res.status < 300) {
            console.log(`${url} is online and returned status: ${res.status}`);
            status = 'online';
        } else {
            console.log(`${url} responded with unexpected status: ${res.status}`);
            status = 'unexpected';
        }
    } catch (error) {
        if (error.response) {
            console.log(`${url} is online but returned an error status: ${error.response.status}`);
            status = 'unexpected';
        } else {
            console.log(`${url} is offline or unreachable. Error: ${error.message}`);
            status = 'offline';
        }
    }

    db.saveUptime({
        type: 'webresponse',
        id: id,
        displayName: name,
        url: url,
        status: status,
    });
};

const checkContainsKeyword = async (url, keyword, name, id) => {
    let status = '';

    try {
        const res = await axios.get(url);
        if (res.data.includes(keyword)) {
            console.log(`${url} contains keyword: ${keyword}`);
            status = 'online';
        } else {
            console.log(`${url} does not contain keyword: ${keyword}`);
            status = 'offline';
        }
    } catch (error) {
        console.error(error);
        status = 'offline';
    }

    db.saveUptime({
        type: 'keyword',
        id: id,
        displayName: name,
        url: url,
        status: status,
        keyword: keyword,
    });
};

// Export all config - do not modify!
const utilExports = {
    checkDomain,
    checkPort,
    checkWebResponse,
    checkContainsKeyword,
};

module.exports = utilExports;
