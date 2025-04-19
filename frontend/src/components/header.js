import React from 'react'
import styled from 'styled-components'

const HeaderLayout = styled.div({
  position: 'fixed',
  top: '0',
  height: '70px',
  width: '100%',
  background: 'white',
  zIndex: '1',
  boxShadow: '0px 1px 3px',
})

export default function Header() {
  return (
    <HeaderLayout>

    </HeaderLayout>
  )
}
