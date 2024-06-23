import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  padding: 16px 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  border-left: 2px solid rbga(255, 255, 255, 0.4);
`;

const HeaderTitle = styled.h1`
  margin: 0;
  color: white;
  font-size: 28px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;
const Header = () => (
  <HeaderContainer style = {{ marginLeft: '0px' }}>
    <HeaderTitle style = {{marginLeft: '65px'}}>Fisher-Friday
    </HeaderTitle>
  </HeaderContainer>
);

export default Header;