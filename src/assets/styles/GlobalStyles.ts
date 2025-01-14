import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, ${theme.colors.gradient.start} 0%, ${theme.colors.gradient.end} 100%);
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${theme.colors.text.primary};
    margin: 0;
    font-weight: 600;
  }

  .ant-layout {
    background: transparent;
  }

  .ant-menu {
    background: transparent;
    border: none;
  }

  .ant-card {
    border-radius: ${theme.borderRadius.medium};
    transition: ${theme.transitions.default};

    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.hover};
    }
  }

  .ant-btn {
    border-radius: ${theme.borderRadius.small};
    box-shadow: ${theme.shadows.button};
    height: 40px;
    padding: 0 20px;
    font-weight: 500;

    &.ant-btn-primary {
      background: ${theme.colors.primary};
      border-color: ${theme.colors.primary};

      &:hover {
        background: ${theme.colors.secondary};
        border-color: ${theme.colors.secondary};
      }
    }
  }

  .ant-select {
    .ant-select-selector {
      border-radius: ${theme.borderRadius.small};
      height: 40px;
      padding: 4px 11px;
      display: flex;
      align-items: center;
    }
  }
`; 