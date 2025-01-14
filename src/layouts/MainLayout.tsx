import React from 'react';
import { Layout, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { NavMenu } from '../components/common/NavMenu';

const { Header, Content } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
`;

const StyledHeader = styled(Header)`
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 80px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 24px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  span {
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const MainContent = styled(Content)`
  padding: 24px;
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
`;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledLayout>
      <NavMenu />

      <MainContent>
        <Outlet />
      </MainContent>
    </StyledLayout>
  );
};

export default MainLayout;
