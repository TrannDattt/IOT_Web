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
        rowGap: '50px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        columnGap: '50px',
    },

    '& .realtime-chart':{
        gridColumn: '1 / span 2',
        gridRow: '2',
        gap: '20px',
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 2px 5px',

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
    const [curData, setCurData] = useState({temp: 18, hum: 50, lint: 100})

    useEffect(() => {
        GetLatestData(1)
        const interval = setInterval(() => GetLatestData(1), 2000)
        return () => clearInterval(interval)
    }, [])

    const GetLatestData = async () => {
        try
        {
            const response = await axios.get(`${API_BASE_URL}/censor-data/get-latest`)
            const { data } = response.data

            if(data) {
                const latestData = data[0]

                setCurData({
                    temp: parseFloat(latestData.temp).toFixed(2),
                    hum: parseFloat(latestData.hum).toFixed(2),
                    lint: parseFloat(latestData.lint).toFixed(2)
                })
            }
        } catch (error) {
            console.error("Error fetching latest data: ", error);
        }
    }

    return(
        <DashboardLayout>
            <div className="cur-data">
                <DataBlock style={{border: '4px solid rgb(235, 155, 79)'}}>
                    <h4 className="label">Temperature<FaTemperatureHigh style={{color: 'rgb(235, 155, 79)'}} /></h4>
                    <p className="data">{curData.temp} C</p>
                </DataBlock>

                <DataBlock style={{border: '4px solid rgb(73, 158, 198)'}}>
                    <h4 className="label">Humidity<IoIosWater style={{color: 'rgb(73, 158, 198)'}} /></h4>
                    <p className="data">{curData.hum}%</p>
                </DataBlock>

                <DataBlock style={{border: '4px solid rgb(215, 230, 81)'}}>
                    <h4 className="label">Light Intensity<FaLightbulb style={{color: 'rgb(215, 230, 81)'}} /></h4>
                    <p className="data">{curData.lint} lux</p>
                </DataBlock>

                {/* <DataBlock style={{border: '4px solid rgb(215, 230, 81)'}}>
                    <h4 className="label">Dust<FaLightbulb style={{color: 'rgb(26, 27, 109)'}} /></h4>
                    <p className="data">{curData.lint} %</p>
                </DataBlock>

                <DataBlock style={{border: '4px solid rgb(215, 230, 81)'}}>
                    <h4 className="label">Wind Speed<FaLightbulb style={{color: 'rgb(230, 81, 151)'}} /></h4>
                    <p className="data">{curData.lint} m/s</p>
                </DataBlock> */}

            </div>

            <div className="realtime-chart">
                <DataChart />
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