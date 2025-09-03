import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.lightBrown};
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.white};
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const ProductCard = ({ product }) => (
  <Card>
    <Link to={`/product/${product.id}`}>
      <h3>{product.name}</h3>
      <p>Giá: {product.price} VND</p>
      <p>Màu: {product.color}</p>
    </Link>
  </Card>
);

export default ProductCard;