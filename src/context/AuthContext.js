import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const login = (payload) => {
    localStorage.setItem('token', payload.token);
    localStorage.setItem('user', JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>
    {children}
  </AuthContext.Provider>;
}
