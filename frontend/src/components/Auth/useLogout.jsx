import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Context } from '../../main';
import { BASE_URL } from '../../../helper.js';

const useLogout = () => {
  
  const { setIsAuthorized, setUser } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/user/logout`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success(data.message);
      setIsAuthorized(false);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      toast.error(`Something went wrong: ${error.response?.data?.message || error.message}`);
      console.log(error);
    }
  };

  return handleLogout;
};

export default useLogout;
