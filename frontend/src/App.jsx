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
import PostJobs from './components/Job/PostJobs';
import Application from './components/Application/Application';
import MyApplication from './components/Application/MyApplication';
import NotFound from './components/NotFound/NotFound';

function App() {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/user/getUser", { withCredentials: true });
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized, setIsAuthorized, setUser]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={isAuthorized ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthorized ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={isAuthorized ? <Home /> : <Navigate to="/login" />} />
          <Route path="/job/getAll" element={isAuthorized ? <Jobs /> : <Navigate to="/login" />} />
          <Route path="/job/:jobId" element={isAuthorized ? <JobDetails /> : <Navigate to="/login" />} />
          <Route path="/job/post" element={isAuthorized ? <PostJobs /> : <Navigate to="/login" />} />
          <Route path="/job/getMyJobs" element={isAuthorized ? <MyJobs /> : <Navigate to="/login" />} />
          <Route path="/application/:id" element={isAuthorized ? <Application /> : <Navigate to="/login" />} />
          <Route path="/applications/me" element={isAuthorized ? <MyApplication /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
