const express = require('express');
const mqttClient = require('../config/mqtt');
const db = require('../config/database');

const router = express.Router();

let buttonState = {}; // Store button states for devices

// Publish button action to MQTT
router.post('/button-action', (req, res) => {
    const { deviceName, action } = req.body;

    if (!deviceName || !action) {
        return res.status(400).json({ error: 'Device name and action are required' });
    }

    const topic = 'action/button';
    const message = `${deviceName}: ${action}`;

    mqttClient.publish(topic, message, (err) => {
        if (err) {
            console.error('Error publishing to MQTT:', err);
            return res.status(500).json({ error: 'Failed to publish action' });
        }

        console.log(`Action "${message}" published to topic "${topic}"`);
        res.status(200).json({ success: true, message: `Action "${message}" sent to device "${deviceName}"` });
    });
});

mqttClient.on('connect', () => {
    mqttClient.subscribe('action/response', (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', err);
        } else {
            console.log('Successfully subscribed to topic: action/response');
        }
    });
});

// Listen for MQTT responses and update button state
mqttClient.on('message', async (topic, message) => {
    if (topic === 'action/response') {
        const action = message.toString(); // Parse the response
        const [device, state] = action.split(': ');

        if (device && state) {
            buttonState[device.trim()] = state.trim(); // Update button state
            console.log(`Updated state for ${device.trim()}: ${state.trim()}`);

            // Insert the state into the database
            await db.query('INSERT INTO actions (device, action) VALUES (?, ?)', [
                device.trim(),
                state.trim(),
            ])
                .then(() => {
                    console.log(`Inserted state for ${device.trim()} into database`);
                })
                .catch((error) => {
                    console.error('Failed to insert state into database:', error);
                });
        }
    }
});

// Get button state from MQTT response
router.get('/button-response', (req, res) => {
    const { deviceName } = req.query;

    if (!deviceName) {
        return res.status(400).json({ error: 'Device name is required' });
    }

    const state = buttonState[deviceName];
    if (!state) {
        console.log(`No state found for device: ${deviceName}`);
        // return res.status(400).json({ error: 'No state found for the specified device' });
        return res.status(200).json({ success: true, state: false });
    }

    res.status(200).json({ success: true, state });
});

module.exports = router;