import React, { useEffect, useRef, useState } from 'react'
import {Line} from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"
import axios from 'axios'
import { API_BASE_URL } from '../config'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const MAX_POINT = 10

const DataChart = () => {
    const [tempData, setTempData] = useState([])
    const [humData, setHumData] = useState([])
    const [lintData, setLintData] = useState([])
    const [timeData, setTimeData] = useState([])

    const GetLatestData = async () => {
      try
      {
          const response = await axios.get(`${API_BASE_URL}/censor-data/get-latest`, {
            params: { amount: MAX_POINT }
          })
          const { data } = response.data

          if(data) {
              setTempData(data.map((item) => item.temp))
              setHumData(data.map((item) => item.hum))
              setLintData(data.map((item) => item.lint))
              setTimeData(data.map((item) => item.time))
            }
      } catch (error) {
          console.error("Error fetching latest data: ", error);
      }
    } 

    const chartData = {
      labels: timeData,
      datasets: [
        {
          label: "Temperature",
          data: tempData,
          borderColor: "rgb(235, 155, 79)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
        
        {
          label: "Humidity",
          data: humData,
          borderColor: "rgb(73, 158, 198)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
        
        {
          label: "Intensity",
          data: lintData,
          borderColor: "rgb(215, 230, 81)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    }

    useEffect(() => {
      GetLatestData()
      const interval = setInterval(() => GetLatestData(), 2000);
      return () => clearInterval(interval)
    }, [tempData, humData, lintData, timeData])

    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
    }

    return <Line data={chartData} options={options} />
}

export default DataChart 
