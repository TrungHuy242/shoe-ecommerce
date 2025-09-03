import styled from 'styled-components';

const FooterStyled = styled.footer`
  background-color: ${({ theme }) => theme.colors.lightBrown};
  color: #FFFFFF;
  text-align: center;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const Footer = () => (
  <FooterStyled>
    <p>&copy; 2025 Shoe Store. All rights reserved.</p>
  </FooterStyled>
);

export default Footer;