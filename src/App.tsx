import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import MainLayout from './layouts/MainLayout';
import TrainingView from './views/TrainingView';
import ExerciseView from './views/ExerciseView';
import EL1View from './views/EL1View';
import EL2View from './views/EL2View';
import EL3View from './views/EL3View';
import { theme } from './assets/styles/theme';
import { GlobalStyles } from './assets/styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme.colors.primary,
            borderRadius: parseInt(theme.borderRadius.small),
            colorBgContainer: theme.colors.background.card,
          },
        }}
      >
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/training" replace />} />
              <Route path="training" element={<TrainingView />} />
              <Route path="exercise/:exerciseId" element={<ExerciseView />} />
              <Route path="el1" element={<EL1View />} />
              <Route path="el2" element={<EL2View />} />
              <Route path="el3" element={<EL3View />} />
              <Route path="progress" element={<div>Progress View (Coming Soon)</div>} />
              <Route path="tests" element={<div>Tests View (Coming Soon)</div>} />
              <Route path="settings" element={<div>Settings View (Coming Soon)</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default App;
