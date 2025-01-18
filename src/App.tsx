import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import MainLayout from './layouts/MainLayout';
import TrainingView from './views/TrainingView';
import EL1View from './views/EL1View';
import EL2View from './views/EL2View';
import EL3View from './views/EL3View';
import EO1View from './views/EO1View';
import EO2View from './views/EO2View';
import EO3View from './views/EO3View';
import EO4View from './views/EO4View';
import EPM1View from './views/EPM1View';
import EPM2View from './views/EPM2View';
import EPM3View from './views/EPM3View';
import EVM1View from './views/EVM1View';
import EVM2View from './views/EVM2View';
import EVM3View from './views/EVM3View';
import EVM4View from './views/EVM4View';
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
              <Route path="el1" element={<EL1View />} />
              <Route path="el2" element={<EL2View />} />
              <Route path="el3" element={<EL3View />} />
              <Route path="eo1" element={<EO1View />} />
              <Route path="eo2" element={<EO2View />} />
              <Route path="eo3" element={<EO3View />} />
              <Route path="eo4" element={<EO4View />} />
              <Route path="epm1" element={<EPM1View />} />
              <Route path="epm2" element={<EPM2View />} />
              <Route path="epm3" element={<EPM3View />} />
              <Route path="evm1" element={<EVM1View />} />
              <Route path="evm2" element={<EVM2View />} />
              <Route path="evm3" element={<EVM3View />} />
              <Route path="evm4" element={<EVM4View />} />
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
