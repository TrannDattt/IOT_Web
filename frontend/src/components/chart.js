import React, { useEffect, useRef, useState } from 'react'
import {Line} from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"
import axios from 'axios'
import { API_BASE_URL } from '../config'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const MAX_POINT = 10

const DataChart = ({ fieldsToFetch }) => {
    // Data
    const [chartFields, setChartFields] = useState([]); // Lưu trữ các trường dữ liệu
    const [chartData, setChartData] = useState({}); // Lưu trữ dữ liệu của từng trường
    const [timeData, setTimeData] = useState([]); // Lưu trữ dữ liệu thời gian

    // Bảng màu cố định
    const colorPalette = useRef({}); // Sử dụng useRef để lưu bảng màu cố định

    const GetLatestData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/censor-data/get-latest`, {
                params: { amount: MAX_POINT },
            });
            const { data } = response.data;

            if (data && data.length > 0) {
                // Lấy danh sách các trường từ dữ liệu, chỉ giữ lại các trường trong fieldsToFetch
                const fields = Object.keys(data[0]).filter((key) => fieldsToFetch.includes(key));
                setChartFields(fields);

                // Cập nhật dữ liệu cho từng trường
                const newChartData = {};
                fields.forEach((field) => {
                    newChartData[field] = data.map((item) => item[field]);

                    // Gán màu cố định cho từng trường nếu chưa có
                    if (!colorPalette.current[field]) {
                        colorPalette.current[field] = getRandomColor();
                    }
                });
                setChartData(newChartData);

                // Cập nhật dữ liệu thời gian
                setTimeData(data.map((item) => item.time));
            }
        } catch (error) {
            console.error("Error fetching latest data: ", error);
        }
    };

    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const dynamicChartData = {
        labels: timeData,
        datasets: chartFields.map((field) => ({
            label: field.charAt(0).toUpperCase() + field.slice(1), // Tên trường
            data: chartData[field], // Dữ liệu của trường
            borderColor: colorPalette.current[field], // Sử dụng màu cố định
            backgroundColor: "rgba(75, 192, 192, 0.2)",
        })),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    useEffect(() => {
        GetLatestData();
        const interval = setInterval(() => GetLatestData(), 2000);
        return () => clearInterval(interval);
    }, [fieldsToFetch]); // Thêm fieldsToFetch vào dependency để cập nhật khi thay đổi

    return <Line data={dynamicChartData} options={options} />;
};

export default DataChart;
