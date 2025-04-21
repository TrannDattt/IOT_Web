import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useState } from "react";

import axios from 'axios'

import DataTable from "../components/table";
import { API_BASE_URL } from "../config";

const HistoryLaout = styled.div({
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

        '& .dropdown': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            
            '& select': {
                height: '40px',
                borderRadius: '5px',
            }
        }
    },
})

// const actionData = [
//     {id: 0, device: 'Light', action: 'ON', time: '2025-02-14 09:00:00'},
//     {id: 1, device: 'Fan', action: 'OFF', time: '2025-02-14 10:00:00'},
//     {id: 2, device: 'Fan', action: 'ON', time: '2025-02-14 11:00:00'},
//     {id: 3, device: 'Light', action: 'OFF', time: '2025-02-14 12:00:00'},
//     {id: 4, device: 'Light', action: 'ON', time: '2025-02-14 13:00:00'},
//     {id: 5, device: 'Light', action: 'OFF', time: '2025-02-14 14:00:00'},
//     {id: 6, device: 'Fan', action: 'OFF', time: '2025-02-14 15:00:00'},
//     {id: 7, device: 'Light', action: 'ON', time: '2025-02-14 16:00:00'},
// ]

const actionColumns = [
    {header: 'ID', accessor: 'id', sortable: false},
    {header: 'Device', accessor: 'device', sortable: false},
    {header: 'Action', accessor: 'action', sortable: false},
    {header: 'Time', accessor: 'time', sortable: true},
]

export default function History(){
    const dataType = 'actions'
    const tableRef = useRef()
    const [searchValue, setSearchValue] = useState('')

    const HandleValueChange = (e) => {
        var value = e.target.value.trim()
        setSearchValue(value)
    }

    useEffect(() => {
        tableRef.current.updateTable({value: searchValue})
        tableRef.current.getPageCount({ value: searchValue })
    }, [searchValue])

    return(
        <HistoryLaout>
            <div className="history-search">
                Search:

                <input className="search-bar"
                    type="text"
                    placeholder="Search..."
                    onChange={HandleValueChange}
                />

            </div>

            <DataTable 
                ref={tableRef} 
                dataType={dataType} 
                columns={actionColumns} 
                searchValue={searchValue}
                searchCategory={'time'}/>

        </HistoryLaout>
    );
}