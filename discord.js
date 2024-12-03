const config = require('./config.js');
const axios = require('axios');

// sendEmbed: handles sending the raw webhook with the embed
const sendEmbed = async (name, id, url, lastChecked, title, description, color, content) => {
    if (!config.enableDiscord) return; // Don't send if Discord is disabled

    // If pingGroup is true, add the role mention to the content
    if (config.pingGroup) {
        content = `<@&${config.groupID}> ${content}`;
    }

    const embed = {
        title,
        description,
        color,
        fields: [
            {
                name: 'URL',
                value: url || 'N/A',
                inline: true,
            },
            {
                name: 'Last Checked',
                value: lastChecked || 'Unknown',
                inline: true,
            }
        ],
        footer: {
            text: 'Status Monitoring System',
        },
        timestamp: new Date(),
    };

    try {
        const response = await axios.post(config.discordWebhook, {
            content,
            embeds: [embed]
        });
        console.log(`Webhook for "${name}" sent successfully.`);
    } catch (error) {
        console.error(`Failed to send webhook for "${name}":`, error.response ? error.response.data : error);
    }
};

const sendHostBackUp = (name, id, url, lastChecked) => {
    const title = `Host Back Up - ${name}`;
    const description = `${name} (ID: ${id}) is now back online and functioning properly.`;
    const color = 0x00FF00; // Green
    const content = config.funnyMessages
        ? `Good morning! This is Tim Cook aka Tim Apple from Apple Park. Today, we have some huge news. ${name} is back online and we are sure you will love it! Sent from my iPhone`
        : `The host ${name} is back online.`;

    sendEmbed(name, id, url, lastChecked, title, description, color, content);
};

const sendHostDown = (name, id, url, lastChecked) => {
    const title = `Host Down - ${name}`;
    const description = `${name} (ID: ${id}) is currently down and unreachable.`;
    const color = 0xFF0000; // Red
    const content = config.funnyMessages
        ? `Good morning! This is Tim Cook aka Tim Apple from Apple Park. It looks like ${name} has gone offline...and we are sure you will love it! Sent from my iPhone`
        : `${name} is down and not responding!`;

    sendEmbed(name, id, url, lastChecked, title, description, color, content);
};

const sendHostUnexpectedStatus = (name, id, url, lastChecked) => {
    const title = `Host Responding with Unexpected Status - ${name}`;
    const description = `${name} (ID: ${id}) is responding with an unexpected status.`;
    const color = 0xFFA500; // Orange
    const content = config.funnyMessages
        ? `Good morning! This is Tim Cook aka Tim Apple from Apple Park. It looks like ${name} is responding with an unexpected status code...and we are sure you will love it! Sent from my iPhone`
        : `${name} is responding with an unexpected status. Check it out!`;

    sendEmbed(name, id, url, lastChecked, title, description, color, content);
};

// Export functions for use in other parts of your app
module.exports = {
    sendHostBackUp,
    sendHostDown,
    sendHostUnexpectedStatus,
};
