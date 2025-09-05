import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => (
  <div className="card">
    <Link to={`/product/${product.id}`}>
      <img className="product-image" src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
      <h3>{product.name || 'Tên sản phẩm'}</h3>
      <p>Giá: {product.price ? `${product.price.toLocaleString()}₫` : '0₫'}</p>
      <p>
        <s>{product.originalPrice ? `${product.originalPrice.toLocaleString()}₫` : ''}</s>
      </p>
      <button>Thêm vào giỏ</button>
    </Link>
  </div>
);

export default ProductCard;