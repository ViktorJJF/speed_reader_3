import React from 'react';
import { Button, Space } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0;
  margin: 0;
  background: #000000;
  padding: 4px;
`;

const StyledButton = styled(Button)<{ $active?: boolean }>`
  height: 40px;
  padding: 4px 20px;
  background: ${(props) => (props.$active ? '#cc0000' : '#ff0000')} !important;
  border: none !important;
  border-radius: 0 !important;
  color: white !important;
  font-weight: 500;
  box-shadow: none !important;

  &:hover {
    background: #cc0000 !important;
  }
`;

const ExerciseButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0;
  margin: 0;
  background: #000000;
  padding: 4px;

  button {
    height: 40px;
    padding: 4px 20px;
    background: ${(props) => (props.active ? '#ffffff' : '#666666')};
    border: none;
    border-radius: 0;
    color: black;
    font-weight: 500;
    min-width: 60px;

    &:hover {
      background: #ffffff;
    }
  }
`;

export const NavMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      key: '/progress',
      label: 'Progreso',
    },
    {
      key: '/tests',
      label: 'Tests',
    },
    {
      key: '/training',
      label: 'Entrenamiento',
    },
    {
      key: '/settings',
      label: 'Configuración',
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%', gap: 0 }}>
      <NavContainer>
        {navItems.map((item) => (
          <StyledButton key={item.key} $active={location.pathname === item.key} onClick={() => navigate(item.key)}>
            {item.label}
          </StyledButton>
        ))}
      </NavContainer>
      <ExerciseButtons>
        <Button
          onClick={() => navigate('/el1')}
          style={{ background: location.pathname === '/el1' ? '#ffffff' : '#666666' }}
        >
          EL1
        </Button>
        <Button onClick={() => navigate('/exercise/el')}>EL</Button>
        <Button onClick={() => navigate('/exercise/eo')}>EO</Button>
        <Button onClick={() => navigate('/exercise/epm')}>EPM</Button>
        <Button onClick={() => navigate('/exercise/evm')}>EVM</Button>
        <Button onClick={() => navigate('/exercise/emd')}>EMD</Button>
      </ExerciseButtons>
    </Space>
  );
};
