import './App.css';
import { Context } from './main';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useContext, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './components/Home/Home';
import Jobs from './components/Job/Jobs';
import JobDetails from './components/Job/JobDetails';
import MyJobs from './components/Job/MyJobs';
import PostJob from './components/Job/PostJob.jsx';
import Application from './components/Application/Application';
import MyApplication from './components/Application/MyApplications.jsx';
import NotFound from './components/NotFound/NotFound';
import { BASE_URL } from '../helper.js';

function App() {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/user/getUser`, { withCredentials: true });
        console.log('User data fetched from API:', response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log(response)
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('user');
        setIsAuthorized(false);
      }
    };
    const storedUser = localStorage.getItem('user');
    if(storedUser){
      setUser(JSON.parse(storedUser));
      setIsAuthorized(true);
    }
    else{
      fetchUser();
    }
  }, [setIsAuthorized, setUser]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isAuthorized ? <Home /> : <Navigate to="/login" />} />
          <Route path="/job/getAll" element={isAuthorized ? <Jobs /> : <Navigate to="/login" />} />
          <Route path="/job/:jobId" element={isAuthorized ? <JobDetails /> : <Navigate to="/login" />} />
          <Route path="/job/post" element={isAuthorized ? <PostJob /> : <Navigate to="/login" />} />
          <Route path="/job/me" element={isAuthorized ? <MyJobs /> : <Navigate to="/login" />} />
          <Route path="/application/:id" element={isAuthorized ? <Application /> : <Navigate to="/login" />} />
          <Route path="/application/me" element={isAuthorized ? <MyApplication /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
