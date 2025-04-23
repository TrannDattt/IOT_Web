import React, {useRef, useState, useEffect, forwardRef, useImperativeHandle, useCallback} from 'react'
import ReactPaginate from 'react-paginate'
import styled from 'styled-components'
import { FaAngleDown, FaAngleUp } from "react-icons/fa"
import { RiArrowUpDownFill } from "react-icons/ri"
import axios from 'axios'
import { API_BASE_URL } from '../config'

const TableLayout = styled.div({
    height: 'fit-content',
    minHeight: '420px',
    padding: '20px',
    marginTop: '20px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0px 2px 5px',

    '& table': {
        width: '100%',
        borderCollapse: 'collapse',
        borderRadius: '7px',
        background: '#4F5577',

        '& thead': {
            color: 'white',
        },

        '& tbody': {
            background: 'white',
        },

        '& tbody tr:hover': {
            background: '#f0f0f0', // Highlight row on hover
            cursor: 'pointer',
        },

        '& tr, & td, & th': {
            padding: '8px',
            textAlign: 'center',
            borderBottom: '1px solid rgb(140, 140, 140)',
        },

        '& th button': {
            marginLeft: '5px',
            border: '0',
            background: 'transparent',
            color: 'white',
        },

        '& th button:hover': {
            color: '#BBBBBB',
        },
    },

    '& .paginator': {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
        listStyle: 'none',

        'li': {
            height: '20px',
            width: '20px',
            borderRadius: '5px',
            padding: '5px',
            margin: '5px',
            justifyContent: 'center',
            textAlign: 'center',
            background: '#4F5577',
            cursor: 'pointer',

            'a': {
                color: 'white',
            },
        },

        'li:hover': {
            background: '#63698A',
        },

        'li.active': {
            background: '#63698A',
            color: 'white',
            fontWeight: 'bold',
        },
    },

    '& .page-controls': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
    },

    '& .page-size': {
        display: 'flex',
        alignItems: 'center',
    },

    '& .page-size input': {
        width: '50px',
        marginLeft: '10px',
        borderRadius: '5px',
        padding: '5px',
    },

    '& .refresh-button': {
        background: '#4F5577',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
    },

    '& .refresh-button:hover': {
        background: '#63698A',
    },
});

const DataTable = forwardRef(({ dataType, columns, searchValue, searchCategory }, ref) => {
    const curPageSize = useRef(6);
    const [pageSize, setPageSize] = useState(curPageSize.current);
    const [curPage, setCurPage] = useState(0);
    const [curOrderCat, setOrderCat] = useState('time');
    const [curOrder, setCurOrder] = useState('desc');
    const [selectedData, setSelectedData] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const UpdateTableData = useCallback(async ({
        category = searchCategory,
        value = searchValue,
        order = curOrder,
        orderCat = curOrderCat,
        page = curPage,
        pageSize = curPageSize.current,
    } = {}) => {
        setIsLoading(true);
        try {
            let response;
            if (dataType === 'censor-data') {
                response = await axios.get(`${API_BASE_URL}/${dataType}/get-table-data`, {
                    params: { category, value, order, orderCat, page: page + 1, pageSize },
                });
            } else {
                response = await axios.get(`${API_BASE_URL}/${dataType}/get-table-data`, {
                    params: { value, order, page: page + 1, pageSize },
                });
            }
            const newData = response.data.data;
            setSelectedData(newData);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [dataType, searchValue, searchCategory, curOrder, curOrderCat, curPage]);

    const GetPageCount = useCallback(async ({ category = searchCategory, value = searchValue } = {}) => {
        try {
            let response;
            if (dataType === 'censor-data') {
                response = await axios.get(`${API_BASE_URL}/${dataType}/count-selected-data`, {
                    params: { category, value },
                });
            } else {
                response = await axios.get(`${API_BASE_URL}/${dataType}/count-selected-data`, {
                    params: { value },
                });
            }
            const dataCount = response.data.count.data_count;
            const newPageCount = Math.ceil(parseInt(dataCount) / pageSize);
            setPageCount(newPageCount);
            UpdateCurPage(0); 
        } catch (error) {
            console.log('Error fetching page count:', error);
        }
    }, [dataType, pageSize, searchValue, searchCategory]);

    useEffect(() => {
        UpdateTableData();
    }, [curOrder, curOrderCat, pageSize, searchValue, searchCategory, UpdateTableData]);

    useEffect(() => {
        GetPageCount();
    }, [curOrder, curOrderCat, pageSize, searchValue, searchCategory, GetPageCount]);

    const HandleSort = (category) => {
        const isAsc = curOrderCat === category.accessor && curOrder === "asc";
        const newOrder = isAsc ? 'desc' : 'asc';
        setCurOrder(newOrder);
        setOrderCat(category.accessor);
        UpdateCurPage(0); 
    };

    const HandlePageClick = (e) => {
        UpdateCurPage(e.selected);
        UpdateTableData({ page: e.selected });
    };

    const HandlePageSizeChange = (e) => {
        const newPageSize = parseInt(e.target.value) || 1;
        UpdatePageSize(newPageSize);
        UpdateCurPage(0); 
        UpdateTableData({ pageSize: newPageSize }); 
    };

    const UpdatePageSize = (newPageSize) => {
        curPageSize.current = newPageSize;
        setPageSize(newPageSize);
    };

    const UpdateCurPage = (newPage) => {
        setCurPage(newPage);
    };

    useImperativeHandle(ref, () => ({
        updateTable: UpdateTableData,
        getPageCount: GetPageCount,
    }));

    return (
        <TableLayout>
            <table>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                        <th key={index}>
                            {col.header}
                            {col.sortable && (
                                <button onClick={() => HandleSort(col)}>
                                    {curOrderCat === col.accessor ? (
                                        curOrder === "desc" ? <FaAngleDown /> : <FaAngleUp />
                                    ) : (
                                        <RiArrowUpDownFill />
                                    )}
                                </button>
                            )}
                        </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length}>Loading...</td>
                        </tr>
                    ) : selectedData.length > 0 ? (
                        selectedData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col.accessor === "id"
                                            ? String(row[col.accessor]).slice(0, 5) + "..."
                                            : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length}>No data found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ReactPaginate
                className="paginator"
                previousLabel={"◀"}
                nextLabel={"▶"}
                pageCount={pageCount}
                onPageChange={HandlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                forcePage={curPage}
            />

            <div className="page-controls">
                <div className="page-size">
                    Page size: 
                    <input value={`${pageSize}`} onChange={HandlePageSizeChange} />
                </div>

                <button className="refresh-button" onClick={() => UpdateTableData()}>
                    Refresh
                </button>
            </div>
        </TableLayout>
    );
});

export default DataTable;
