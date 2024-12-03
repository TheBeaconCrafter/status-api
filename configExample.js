
const pingInterval = 60000; // Interval in ms for the ping check

// Hosts for which you want to check if they are up (ping)
// Do not add https:// or http:// to the hostnames
const hosts = [
    {id: 1, name: 'Homepage', url: 'example.org'},
    {id: 2, name: 'CDN', url: 'cdn.example.org'},
    {id: 3, name: 'Cloud', url: 'cloud.example.org'},
]

// Hosts for which you want to check if a port is open/responsive
const hostPorts = [
    {id: 1, name: 'Server Port 22', url: 'example.org', port: 22},
]

// Hosts for which you want to check the response status (needs https:// or http://)
const hostWebResponse = [
    {id: 1, name: 'Homepage', url: 'https://example.org'},
]

// Hosts for which you want to check if they contain a keyword (needs https:// or http://)
const hostContainsKey = [
    {id: 1, name: 'Homepage', url: 'https://example.org', keyword: 'mobile'},
]

// Export all config - do not modify!
const secrets = {
    hosts,
    hostPorts,
    hostWebResponse,
    hostContainsKey,
    pingInterval
};
module.exports = secrets;