import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components'

const Layout = styled.div({
    marginTop: '70px',
    background: '#4F5577',
    padding: '10px 0px',
    
    '& nav ul': {
        margin: '0px',
        padding: '0',
        
        '& li': {
            
            '& a': {
                height: '60px',
                width: '270px',
                display: 'flex',
                fontSize: '24px',
                paddingLeft: '30px',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#BBBBBB',
            },
    
            '& a.active, & a:hover': {
                background: '#63698A',
                color: 'white',
            },
        },
    },
    
});

export default function NavLayout() {
  return (
    <Layout>
        <nav>
            <ul>
                <li>
                    <NavLink to='/' className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
                </li>

                <li>
                    <NavLink to='/history' className={({isActive}) => isActive ? 'active' : ''}>History</NavLink>
                </li>

                <li>
                    <NavLink to='/data' className={({isActive}) => isActive ? 'active' : ''}>Data</NavLink>
                </li>

                <li>
                    <NavLink to='/profile' className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink>
                </li>
            </ul>
        </nav>

        <Outlet />
    </Layout>
  )
}
