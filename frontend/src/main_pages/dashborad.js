import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ButtonBlock from "../components/button_block";
import DataChart from "../components/chart";
import { IoIosWater } from "react-icons/io";
import { FaTemperatureHigh, FaLightbulb } from "react-icons/fa";
import axios from 'axios'
import { API_BASE_URL } from "../config";

const DashboardLayout = styled.div({
    display: 'grid',
    padding: '150px 50px 50px 50px',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: '120px 360px',
    gap: '50px',
    
    '& .cur-data':{
        gridColumn: '1 / -1',
        gridRow: '1',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '20px',
    },

    '& .realtime-chart':{
        gridColumn: '1 / span 2',
        gridRow: '2',
        gap: '20px',
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 2px 5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        '& DataChart': {
            height: '100%',
            width: '100%',
            background: 'white',
        },
    },
        
    '& .button-control': {
        gridColumn: '3',
        gridRow: '2',
        display: 'grid',
        gridTemplateRows: 'repeat(3, 1fr)',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0px 2px 5px',
    },
        
})

const DataBlock = styled.div({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    background: 'white',
    boxShadow: '0px 2px 5px',

    '& .label':{
        margin: '10px 0px',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },

    '& .data':{
        margin: '10px 0px',
        fontSize: '24px',
    },
})

export default function Dashboard(){
    const [curData, setCurData] = useState({})

    useEffect(() => {
        GetLatestData(1)
        const interval = setInterval(() => GetLatestData(1), 2000)
        return () => clearInterval(interval)
    }, [])

    const GetLatestData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/censor-data/get-latest`);
            const { data } = response.data;

            if (data && data.length > 0) {
                const latestData = data[0];

                const updatedData = {};
                Object.keys(latestData).forEach((key) => {
                    if (key !== "time" && key !== "id") { // Loại bỏ các trường không cần thiết
                        updatedData[key] = parseFloat(latestData[key]).toFixed(2);
                    }
                });

                setCurData(updatedData);
            }
        } catch (error) {
            console.error("Error fetching latest data: ", error);
        }
    };

    return(
        <DashboardLayout>
            <div className="cur-data">
                {Object.keys(curData).map((field, index) => {
                    // Định nghĩa màu sắc và biểu tượng cho từng trường
                    const fieldConfig = {
                        temp: { label: "Temperature", color: "rgb(235, 155, 79)", icon: <FaTemperatureHigh /> },
                        hum: { label: "Humidity", color: "rgb(73, 158, 198)", icon: <IoIosWater /> },
                        lint: { label: "Light Intensity", color: "rgb(215, 230, 81)", icon: <FaLightbulb /> },
                        // lent: { label: "Light Intensity", color: "rgb(215, 230, 81)", icon: <FaLightbulb /> },
                    };

                    const config = fieldConfig[field];
                    // const config = fieldConfig[field] || { label: field, color: "rgb(150, 150, 150)", icon: null };

                    return (
                        <DataBlock key={index} style={{ border: `4px solid ${config.color}` }}>
                            <h4 className="label">
                                {config.label} {config.icon && <span style={{ color: config.color }}>{config.icon}</span>}
                            </h4>
                            <p className="data">{curData[field]}</p>
                        </DataBlock>
                    );
                })}
            </div>

            <div className="realtime-chart">
                {/* <DataChart fieldsToFetch={['temp', 'hum']} /> */}
                <DataChart fieldsToFetch={['temp', 'hum', 'lint']} />
            </div>

            <div className="button-control">
                <ButtonBlock deviceName={'Fan'} />
                <ButtonBlock deviceName={'AirCon'} />
                <ButtonBlock deviceName={'Light 1'} />
                {/* <ButtonBlock deviceName={'Light 2'} />
                <ButtonBlock deviceName={'Light 3'} /> */}
            </div>

        </DashboardLayout>
    );
}