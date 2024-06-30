import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

export const Context = createContext({});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  // Load state from localStorage on initial load
  useEffect(() => {
    const storedIsAuthorized = localStorage.getItem('isAuthorized') === 'true';
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (storedIsAuthorized) {
      setIsAuthorized(storedIsAuthorized);
      setUser(storedUser);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isAuthorized', isAuthorized);
    localStorage.setItem('user', JSON.stringify(user));
  }, [isAuthorized, user]);

  return (
    <Context.Provider value={{ isAuthorized, setIsAuthorized, user, setUser }}>
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
