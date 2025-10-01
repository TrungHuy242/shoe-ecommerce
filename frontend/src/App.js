// src/App.js
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;