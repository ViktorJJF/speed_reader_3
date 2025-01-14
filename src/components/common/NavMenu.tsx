import React, { useState } from 'react';
import { Button, Space, Dropdown } from 'antd';
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

const SubMenu = styled.div`
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  min-width: 100px;

  button {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    color: black;

    &:hover {
      background: #f0f0f0;
    }

    &.active {
      background: #e6e6e6;
    }
  }
`;

export const NavMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showELMenu, setShowELMenu] = useState(false);

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

  const elItems = [
    { key: 'el1', label: 'EL1' },
    { key: 'el2', label: 'EL2' },
    { key: 'el3', label: 'EL3' },
    { key: 'el4', label: 'EL4' },
    { key: 'el5', label: 'EL5' },
    { key: 'el6', label: 'EL6' },
    { key: 'el7', label: 'EL7' },
    { key: 'el8', label: 'EL8' },
  ];

  const handleELClick = (key: string) => {
    navigate(`/${key}`);
    setShowELMenu(false);
  };

  const handleELButtonClick = (e: React.MouseEvent) => {
    if (!location.pathname.startsWith('/el')) {
      navigate('/el1');
    }
  };

  const elMenu = {
    items: elItems.map((item) => ({
      key: item.key,
      label: (
        <button
          onClick={() => handleELClick(item.key)}
          className={location.pathname === `/${item.key}` ? 'active' : ''}
        >
          {item.label}
        </button>
      ),
    })),
  };

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
        <Dropdown
          menu={elMenu}
          trigger={['click']}
          placement="bottomLeft"
          open={showELMenu}
          onOpenChange={setShowELMenu}
        >
          <Button
            onClick={handleELButtonClick}
            style={{
              background: location.pathname.startsWith('/el') ? '#ffffff' : '#666666',
              color: 'black',
            }}
          >
            EL
          </Button>
        </Dropdown>
        <Button onClick={() => navigate('/exercise/eo')}>EO</Button>
        <Button onClick={() => navigate('/exercise/epm')}>EPM</Button>
        <Button onClick={() => navigate('/exercise/evm')}>EVM</Button>
        <Button onClick={() => navigate('/exercise/emd')}>EMD</Button>
      </ExerciseButtons>
    </Space>
  );
};
