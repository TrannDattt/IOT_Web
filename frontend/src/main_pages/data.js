import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useState } from "react";
import DataTable from "../components/table";
import axios from 'axios'
import { API_BASE_URL } from "../config";

const CensorDataLaout = styled.div({
    padding: '150px 50px 50px 50px',

    '& .history-search': {
        display: "flex",
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '10px',

        '& .search-bar': {
            height: '40px',
            width: '300px',
            marginRight: '10px',
            paddingLeft: '20px',
            borderRadius: '5px',
            background: 'white',
            border: '0',
            fontSize: '16px',
        },

        '& .dropdown select': {
            height: '40px',
            textAlign: 'center',
            background: '#4F5577',
            border: '0',
            borderRadius: '5px',
            color: 'white',
            fontWeight: 'bold',
        },
    },

    '& .data-table': {
        height: '420px',
        padding: '20px',
        marginTop: '20px',
        background: '#D9D9D9',
    
        '& table': {
            width: '100%',
            background: '#E4E4E4',
            borderCollapse: 'collapse',
        
            '& tr, & td, & th': {
                padding: '8px',
                textAlign: 'left',
                borderBottom: '1px solid rgb(140, 140, 140)',
            },
        },
    },
})

const dataColumns = [
    {header: 'ID', accessor: 'id', sortable: false},
    {header: 'Temperature', accessor: 'temp', sortable: true},
    {header: 'Humidity', accessor: 'hum', sortable: true},
    {header: 'Intensity', accessor: 'lint', sortable: true},
    {header: 'Time', accessor: 'time', sortable: true},
]

export default function Data(){
    const dataType = 'censor-data'
    const tableRef = useRef()

    const [searchValue, setSearchValue] = useState('')
    const [searchCategory, setSearchCategory] = useState('time')

    const HandleCategoryChange = (e) => {
        var category = e.target.value
        setSearchCategory(category)
    }

    const HandleValueChange = (e) => {
        var value = e.target.value.trim()
        setSearchValue(value)
    }

    useEffect(() => {
        tableRef.current.setPage(0); 
        tableRef.current.updateTable({ category: searchCategory, value: searchValue });
        tableRef.current.getPageCount({ category: searchCategory, value: searchValue });
    }, [searchValue, searchCategory])

    return(
        <CensorDataLaout>
            <div className="history-search">
                Search:
                
                <div className="dropdown">
                    <select value={searchCategory} onChange={HandleCategoryChange}>
                        <option value={'temp'}>Temperature</option>
                        <option value={'hum'}>Humidity</option>
                        <option value={'lint'}>Intensity</option>
                        <option value={'time'}>Time</option>
                    </select>
                </div>

                <input className="search-bar"
                    type="text"
                    placeholder="Search..."
                    onChange={HandleValueChange}
                />

            </div>
            
            <DataTable ref={tableRef} dataType={dataType} columns={dataColumns} />

        </CensorDataLaout>
    );
}