import styled from 'styled-components';
import { Card, Layout } from 'antd';
import { theme } from './theme';

const { Header, Content } = Layout;

export const PageHeader = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: ${theme.colors.text.primary};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const StyledCard = styled(Card)`
  background: ${theme.colors.background.card};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.card};

  .ant-card-head {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding: 16px 24px;
  }

  .ant-card-head-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.1rem;
    
    .anticon {
      font-size: 1.3rem;
      color: ${theme.colors.primary};
    }
  }

  .ant-card-body {
    padding: 24px;
  }
`;

export const StyledHeader = styled(Header)`
  background: transparent;
  padding: 0 24px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const MainContent = styled(Content)`
  padding: 0 24px 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const Controls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: ${theme.colors.background.control};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.card};
`;

export const DisplayArea = styled.div`
  background: white;
  padding: 48px;
  min-height: 300px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 3.5rem;
  font-weight: bold;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  margin: 24px 0;
`;

export const Timer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${theme.colors.primary};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: ${theme.shadows.button};
`;

export const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`; 