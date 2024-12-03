const ping = require('ping');
const net = require('net');
const axios = require('axios');
const db = require('./db');

const checkDomain = async(domain, name, id) => {
    let status = 'offline';
    try {
        const res = await ping.promise.probe(domain);
        if(res.alive) {
            console.log(`${domain} is online`);
            status = 'online';
        } else {
            console.log(`${domain} is offline`);
        }
    } catch (error) {
        console.error(error);
    }
    db.saveUptime({
        type: 'domain',
        id: id,
        displayName: name,
        url: domain,
        status: status,
    });
}

const checkPort = async(host, port) => {
    const socket = net.Socket();

    socket.setTimeout(3000);
    socket.connect(port, host, () => {
        console.log(`${host}:${port} is online`);
        socket.end();
    });

    socket.on('error', (err) => {
        console.log(`${host}:${port} is offline`);
        socket.destroy();
    });

    socket.on('timeout', () => {
        console.log(`${host}:${port} timed out`);
        socket.destroy();
    });
}

const checkWebResponse = async(url) => {
    try {
        const res = await axios.get(url);
        if(res.status >= 200 && res.status < 300) {
            console.log(`${url} is online and returned status: ${res.status}`);
        } else {
            console.log(`${url} responded with unexpected status: ${res.status}`);
        }
    }catch (error) {
        if (error.response) {
            console.log(`${url} is online but returned an error status: ${error.response.status}`);
        } else {
            console.log(`${url} is offline or unreachable. Error: ${error.message}`);
        }
    }
}

const checkContainsKeyword = async(url, keyword) => {
    try {
        const res = await axios.get(url);
        if(res.data.includes(keyword)) {
            console.log(`${url} contains keyword: ${keyword}`);
        } else {
            console.log(`${url} does not contain keyword: ${keyword}`);
        }
    }
    catch (error) {
        console.error(error);
    }
}

// Export all config - do not modify!
const utilExports = {
    checkDomain,
    checkPort,
    checkWebResponse,
    checkContainsKeyword,
};
module.exports = utilExports;