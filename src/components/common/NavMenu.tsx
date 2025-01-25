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
  const [showEOMenu, setShowEOMenu] = useState(false);
  const [showEPMMenu, setShowEPMMenu] = useState(false);
  const [showEVMMenu, setShowEVMMenu] = useState(false);
  const [showEDMMenu, setShowEDMMenu] = useState(false);

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

  const eoItems = [
    { key: 'eo1', label: 'EO1' },
    { key: 'eo2', label: 'EO2' },
    { key: 'eo3', label: 'EO3' },
    { key: 'eo4', label: 'EO4' },
  ];

  const epmItems = [
    { key: 'epm1', label: 'EPM1' },
    { key: 'epm2', label: 'EPM2' },
    { key: 'epm3', label: 'EPM3' },
  ];

  const evmItems = [
    { key: 'evm1', label: 'EVM1' },
    { key: 'evm2', label: 'EVM2' },
    { key: 'evm3', label: 'EVM3' },
    { key: 'evm4', label: 'EVM4' },
  ];

  const edmItems = [
    { key: 'edm1', label: 'EDM1' },
    { key: 'edm2', label: 'EDM2' },
    { key: 'edm3', label: 'EDM3' },
    { key: 'edm4', label: 'EDM4' },
  ];

  const handleELClick = (key: string) => {
    navigate(`/${key}`);
    setShowELMenu(false);
  };

  const handleEOClick = (key: string) => {
    navigate(`/${key}`);
    setShowEOMenu(false);
  };

  const handleEPMClick = (key: string) => {
    navigate(`/${key}`);
    setShowEPMMenu(false);
  };

  const handleEVMClick = (key: string) => {
    navigate(`/${key}`);
    setShowEVMMenu(false);
  };

  const handleEDMClick = (key: string) => {
    navigate(`/${key}`);
    setShowEDMMenu(false);
  };

  const handleELButtonClick = (e: React.MouseEvent) => {
    if (!location.pathname.startsWith('/el')) {
      navigate('/el1');
    }
  };

  const handleEOButtonClick = (e: React.MouseEvent) => {
    if (!location.pathname.startsWith('/eo')) {
      navigate('/eo1');
    }
  };

  const handleEPMButtonClick = (e: React.MouseEvent) => {
    if (!location.pathname.startsWith('/epm')) {
      navigate('/epm1');
    }
  };

  const handleEVMButtonClick = (e: React.MouseEvent) => {
    if (!location.pathname.startsWith('/evm')) {
      navigate('/evm1');
    }
  };

  const handleEDMButtonClick = (e: React.MouseEvent) => {
    if (!location.pathname.startsWith('/edm')) {
      navigate('/edm1');
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

  const eoMenu = {
    items: eoItems.map((item) => ({
      key: item.key,
      label: (
        <button
          onClick={() => handleEOClick(item.key)}
          className={location.pathname === `/${item.key}` ? 'active' : ''}
        >
          {item.label}
        </button>
      ),
    })),
  };

  const epmMenu = {
    items: epmItems.map((item) => ({
      key: item.key,
      label: (
        <button
          onClick={() => handleEPMClick(item.key)}
          className={location.pathname === `/${item.key}` ? 'active' : ''}
        >
          {item.label}
        </button>
      ),
    })),
  };

  const evmMenu = {
    items: evmItems.map((item) => ({
      key: item.key,
      label: (
        <button
          onClick={() => handleEVMClick(item.key)}
          className={location.pathname === `/${item.key}` ? 'active' : ''}
        >
          {item.label}
        </button>
      ),
    })),
  };

  const edmMenu = {
    items: edmItems.map((item) => ({
      key: item.key,
      label: (
        <button
          onClick={() => handleEDMClick(item.key)}
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
        <Dropdown
          menu={eoMenu}
          trigger={['click']}
          placement="bottomLeft"
          open={showEOMenu}
          onOpenChange={setShowEOMenu}
        >
          <Button
            onClick={handleEOButtonClick}
            style={{
              background: location.pathname.startsWith('/eo') ? '#ffffff' : '#666666',
              color: 'black',
            }}
          >
            EO
          </Button>
        </Dropdown>
        <Dropdown
          menu={epmMenu}
          trigger={['click']}
          placement="bottomLeft"
          open={showEPMMenu}
          onOpenChange={setShowEPMMenu}
        >
          <Button
            onClick={handleEPMButtonClick}
            style={{
              background: location.pathname.startsWith('/epm') ? '#ffffff' : '#666666',
              color: 'black',
            }}
          >
            EPM
          </Button>
        </Dropdown>
        <Dropdown
          menu={evmMenu}
          trigger={['click']}
          placement="bottomLeft"
          open={showEVMMenu}
          onOpenChange={setShowEVMMenu}
        >
          <Button
            onClick={handleEVMButtonClick}
            style={{
              background: location.pathname.startsWith('/evm') ? '#ffffff' : '#666666',
              color: 'black',
            }}
          >
            EVM
          </Button>
        </Dropdown>
        <Dropdown
          menu={edmMenu}
          trigger={['click']}
          placement="bottomLeft"
          open={showEDMMenu}
          onOpenChange={setShowEDMMenu}
        >
          <Button
            onClick={handleEDMButtonClick}
            style={{
              background: location.pathname.startsWith('/edm') ? '#ffffff' : '#666666',
              color: 'black',
            }}
          >
            EMD
          </Button>
        </Dropdown>
      </ExerciseButtons>
    </Space>
  );
};
