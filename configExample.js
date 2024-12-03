
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

const enableDiscord = false; // Enable Discord notifications for downtime
const discordWebhook = 'https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz'; // Discord webhook URL
const funnyMessages = false // Enable funny messages for downtime
const pingGroup = false // ping a group on discord - if true, set the group ID below. only works if enableDiscord is true
const groupID = '12345XXXX' // Group ID for ping me

// Export all config - do not modify!
const secrets = {
    hosts,
    hostPorts,
    hostWebResponse,
    hostContainsKey,
    pingInterval,
    enableDiscord,
    discordWebhook,
    funnyMessages,
    pingGroup,
    groupID
};
module.exports = secrets;