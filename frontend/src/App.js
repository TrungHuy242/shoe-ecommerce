// src/App.js
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes';
import Chatbot from './features/user/Chatbot/Chatbot';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { role } = useAuth();
  const location = useLocation();
  const isAdmin = role === 1;
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isForgotPasswordPage = location.pathname === '/forgot-password';
  const isResetPasswordPage = location.pathname === '/reset-password';

  return (
    <div className="App">
      <AppRoutes />
      {/* Chỉ hiển thị chatbot cho user, không hiển thị cho admin và các trang auth */}
      {!isAdmin && !isLoginPage && !isRegisterPage && !isForgotPasswordPage && !isResetPasswordPage && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <AppContent />
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;