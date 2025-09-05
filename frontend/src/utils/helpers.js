export const formatPrice = (price) => `$${price.toFixed(2)}`;
export const isAuthenticated = () => !!localStorage.getItem('token');