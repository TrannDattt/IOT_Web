import React, { useEffect } from 'react'
import styled from 'styled-components'
import NavLayout from './nav_layout';

const SidebarStyled = styled.div({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: '#2F3557',
  color: 'white',

  '& .web-name': {
      height: '70px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '48px',
      fontWeight: 'bold',

      '& a': {
          color: 'white',
          textDecoration: 'none',
      },
  },
});

export default function Sidebar({ user }) {
  return (
    <SidebarStyled>
        <div className='web-name'><a href='/'>CensorData</a></div>
          {user && <NavLayout />}
          {/* <NavLayout /> */}
    </SidebarStyled>
  )
}
