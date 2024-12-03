const utils = require("./utils.js");
const config = require("./config.js");

function schedule() {
    checkPing();
    setInterval(checkPing, config.pingInterval);
    console.log("Pinger scheduled!");
}

function checkPing() {
    for(let i = 0; i < config.hosts.length; i++) {
        utils.checkDomain(config.hosts[i].url, config.hosts[i].name, config.hosts[i].id);
    }
    
    for (let i = 0; i < config.hostPorts.length; i++) {
        utils.checkPort(config.hostPorts[i].url, config.hostPorts[i].port);
    }
    
    for (let i = 0; i < config.hostWebResponse.length; i++) {
        utils.checkWebResponse(config.hostWebResponse[i].url);
    }
    
    for (let i = 0; i < config.hostContainsKey.length; i++) {
        utils.checkContainsKeyword(config.hostContainsKey[i].url, config.hostContainsKey[i].keyword);
    }
}

// Export all config - do not modify!
const pingerExports = {
    schedule,
};
module.exports = pingerExports;