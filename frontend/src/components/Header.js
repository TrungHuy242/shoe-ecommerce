import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderStyled = styled.header`
  background-color: ${({ theme }) => theme.colors.lightBrown};
  padding: 1rem;
  color: #FFFFFF;
  text-align: center;
`;

const Nav = styled.nav`
  margin-top: 1rem;
`;

const NavLink = styled(Link)`
  color: #FFFFFF;
  margin: 0 1rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => (
  <HeaderStyled>
    <h1>Shoe Store</h1>
    <Nav>
      <NavLink to="/">Trang chủ</NavLink>
      <NavLink to="/products">Sản phẩm</NavLink>
      <NavLink to="/cart">Giỏ hàng</NavLink>
    </Nav>
  </HeaderStyled>
);

export default Header;