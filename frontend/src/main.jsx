import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Cookies from 'js-cookie';

export const Context = createContext({});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedToken = Cookies.get('token');
    const storedUser = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};

    console.log('Retrieved token from cookies:', storedToken);
    console.log('Retrieved user from cookies:', storedUser);

    if (storedToken) {
      setIsAuthorized(true);
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      Cookies.set('token', 'your-token', { expires: 7 });
      Cookies.set('user', JSON.stringify(user), { expires: 7 });
    } else {
      Cookies.remove('token');
      Cookies.remove('user');
    }
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
