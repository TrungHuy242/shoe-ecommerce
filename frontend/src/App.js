// src/App.js
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
            <NotificationProvider>
              <Router>
                <div className="App">
                  <AppRoutes />
                </div>
              </Router>
            </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;