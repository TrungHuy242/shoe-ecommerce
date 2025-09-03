import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #F5F5DC;
  }
`;

export const theme = {
  colors: {
    white: '#FFFFFF',
    beige: '#F5F5DC',
    lightBrown: '#D2B48C',
  },
};