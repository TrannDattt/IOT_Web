import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import mqtt from 'mqtt';
import { API_BASE_URL, MQTT_BROKER_URL, MQTT_PASSWORD, MQTT_USERNAME } from '../config';
import { FaFan, FaLightbulb, FaTemperatureHigh, FaTemperatureLow, FaSpinner } from 'react-icons/fa';

// Define the spinning animation
const spin = keyframes`
    0% {
        transform: translateX(0) translateY(-50%) rotate(0deg);
    }
    100% {
        transform: translateX(0) translateY(-50%) rotate(360deg);
    }
`;

const ToggleButton = styled.div({
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '30% auto',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: '20px',
    padding: '10px',

    '& .icon': {
        fontSize: '48px',
    },

    '& .rotating': {
        animation: 'spin 0.5s linear infinite',
    },

    '@keyframes spin': {
        '0%': {
            transform: 'rotate(0deg)',
        },
        '100%': {
            transform: 'rotate(360deg)',
        },
    },

    '& button': {
        width: '30%',
        height: '30px',
        marginLeft: '20px',
        background: '#9A9A9A',
        border: 'solid 1px #9A9A9A',
        borderRadius: '30px',
        transition: 'background 0.5s ease',
        position: 'relative',
        cursor: 'pointer',

        '&.loading': {
            cursor: 'not-allowed',
        },

        '&:hover': {
            background: '#777575',
        },

        '& .thumb': {
            position: 'absolute',
            height: '25px',
            width: '25px',
            borderRadius: '12px',
            background: 'white',
            left: '2px',
            transform: 'translateX(0) translateY(-50%)',
            transition: 'left 0.15s ease',
              display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },

        '&.loading .thumb': {
            animation: css`${spin} 1s linear infinite`,
            background: '#FFD700', // Change background color for loading
        },

        '&.toggled': {
            background: '#26DA68',
        },

        '&.toggled .thumb': {
            left: 'calc(100% - 27px)',
        },
    },
});

export default function ButtonBlock({ deviceName }) {
    const [isToggled, setIsToggled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const mqttClient = useRef(null);

    const DeviceType = Object.freeze({
        Fan: 'Fan',
        AirCon: 'AirCon',
        Light: 'Light 1',
    });

    const HandleClickEvent = async () => {
        const newState = !isToggled ? 'ON' : 'OFF';
        setIsLoading(true); // Set button to loading state

        try {
            // Call backend API to publish action
            await axios.post(`${API_BASE_URL}/mqtt-actions/button-action`, {
                deviceName,
                action: newState,
            });

            console.log(`Action "${newState}" sent for device "${deviceName}"`);
        } catch (error) {
            console.error('Failed to send button action:', error);
            setIsLoading(false); // Exit loading state on error
        }
    };

    useEffect(() => {
        // Connect to the MQTT broker
        mqttClient.current = mqtt.connect(MQTT_BROKER_URL, {
            username: MQTT_USERNAME,
            password: MQTT_PASSWORD,
        });

        mqttClient.current.on('connect', () => {
            console.log('Connected to MQTT broker');
            mqttClient.current.subscribe('action/response', (err) => {
                if (err) {
                    console.error('Failed to subscribe to topic:', err);
                } else {
                    console.log('Subscribed to topic: action/response');
                }
            });
        });

        mqttClient.current.on('message', (topic, message) => {
            if (topic === 'action/response') {
                const action = message.toString(); // Parse the message
                const [name, state] = action.split(': '); // Extract device name and state

                if (name.trim() === deviceName) {
                    setIsToggled(state.trim() === 'ON'); // Update the button state
                    setIsLoading(false); // Exit loading state
                    console.log(`Updated state for ${name.trim()}: ${state.trim()}`);
                }
            }
        });

        return () => {
            mqttClient.current.end(); // Disconnect MQTT client on component unmount
        };
    }, [deviceName]);

    const RenderIcon = () => {
        switch (deviceName) {
            case DeviceType.Fan:
                return (
                    <div
                        style={{
                            color: isToggled ? 'gray' : 'inherit', // Change icon color to gray when toggled
                            transition: 'color 0.5s ease', // Smooth transition for color
                        }}
                        className={isToggled ? 'rotating' : ''} // Add rotating class when toggled
                    >
                        <FaFan />
                    </div>
                );

            case DeviceType.AirCon:
                return (
                    <div
                        style={{
                            color: isToggled ? 'blue' : 'inherit', // Change icon color to blue when toggled
                            transition: 'color 1s ease', // Smooth transition for color
                        }}
                    >
                        {isToggled ? <FaTemperatureLow /> : <FaTemperatureHigh />}
                    </div>
                );

            case DeviceType.Light:
                return (
                    <div
                        style={{
                            color: isToggled ? 'yellow' : 'inherit', // Change icon color to yellow when toggled
                            textShadow: isToggled
                                ? '0 0 10px yellow, 0 0 20px yellow, 0 0 30px yellow' // Add glowing effect
                                : 'none',
                            transition: 'color 0.5s ease, text-shadow 0.5s ease', // Smooth transition for color and glow
                        }}
                    >
                        <FaLightbulb />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <ToggleButton>
            <div className="icon">
                {RenderIcon()}
            </div> 

            <button
                className={`${isLoading ? 'loading' : isToggled ? 'toggled' : ''}`}
                onClick={HandleClickEvent}
                disabled={isLoading} // Disable button while loading
            >
                <div className="thumb">
                    {isLoading && <FaSpinner />}
                </div>
            </button>
        </ToggleButton>
    );
}
