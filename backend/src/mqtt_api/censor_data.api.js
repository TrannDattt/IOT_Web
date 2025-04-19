const express = require('express');
const mqttClient = require('../config/mqtt');
const db = require('../config/database');

const router = express.Router();

mqttClient.on('connect', () => {
    mqttClient.subscribe('sensor/data', (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', err);
        } else {
            console.log('Successfully subscribed to topic: action/response');
        }
    });
});

// Listen for MQTT responses and update button state
mqttClient.on('message', async (topic, message) => {
    if (topic === 'sensor/data') {
        const data = message.toString(); // Parse the message
        console.log(`Received message: ${data}`);

        // Split the message into key-value pairs
        const parts = data.split(','); // Split by commas
        const sensorData = {};

        // Iterate over each part and extract key-value pairs
        parts.forEach((part) => {
            const [key, value] = part.split(':').map((item) => item.trim());
            if (key && value) {
                sensorData[key.toLowerCase()] = parseFloat(value.replace(/[^\d.]/g, '')); // Remove units and parse as float
            }
        });

        // Log the parsed data
        console.log('Parsed Sensor Data:', sensorData);

        // Check if required fields are present
        const { temp, hum, int } = sensorData;
        if (temp !== undefined && hum !== undefined && int !== undefined) {
            console.log(`Parsed Data - Temperature: ${temp} C, Humidity: ${hum}%, Intensity: ${int} lux`);

            // Insert the parsed data into the database
            try {
                await db.query('INSERT INTO censor_data (temp, hum, lint) VALUES (?, ?, ?)', [
                    temp,
                    hum,
                    int,
                ]);
                console.log('Inserted sensor data into database');
            } catch (error) {
                console.error('Failed to insert sensor data into database:', error);
            }
        } else {
            console.error('Missing required fields in message:', data);
        }
    }
});

// Publish data to MQTT
router.post('/publish', (req, res) => {
    const { topic, message } = req.body;

    if (!topic || !message) {
        return res.status(400).json({ error: 'Topic and message are required' });
    }

    mqttClient.publish(topic, message, (err) => {
        if (err) {
            console.error('Error publishing to MQTT:', err);
            return res.status(500).json({ error: 'Failed to publish message' });
        }
        res.status(200).json({ success: true, message: 'Message published successfully' });
    });
});

// Subscribe to an MQTT topic
router.post('/subscribe', (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    mqttClient.subscribe(topic, (err) => {
        if (err) {
            console.error('Error subscribing to MQTT topic:', err);
            return res.status(500).json({ error: 'Failed to subscribe to topic' });
        }
        res.status(200).json({ success: true, message: `Subscribed to topic: ${topic}` });
    });
});

module.exports = router;