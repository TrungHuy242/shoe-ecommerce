import styled from 'styled-components';
import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.beige};
`;

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('products/')
      .then(response => setProducts(response.data.results))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <h2>Sản phẩm nổi bật</h2>
      <Grid>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Grid>
    </div>
  );
};

export default Home;