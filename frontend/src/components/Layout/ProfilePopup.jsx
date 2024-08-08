import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { BASE_URL } from '../../../helper';
import { Context } from '../../main';
import './ProfilePopup.css';

const ProfilePopup = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const { token } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if the user is not logged in
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/user/getUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [token, navigate]);

  if (!user) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('profile-popup')) {
      onClose();
    }
  };

  return (
    <div className="profile-popup" onClick={handleOutsideClick}>
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Profile Details</h2>
        {user.name && <p><strong>Name:</strong> {user.name}</p>}
        {user.email && <p><strong>Email:</strong> {user.email}</p>}
        {user.role && <p><strong>Role:</strong> {user.role}</p>}
        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
        {user.coverLetter && <p><strong>Cover Letter:</strong> {user.coverLetter}</p>}
        {user.niches && (
          <>
            {user.niches.firstNiche && <p><strong>Niche 1:</strong> {user.niches.firstNiche}</p>}
            {user.niches.secondNiche && <p><strong>Niche 2:</strong> {user.niches.secondNiche}</p>}
            {user.niches.thirdNiche && <p><strong>Niche 3:</strong> {user.niches.thirdNiche}</p>}
          </>
        )}
        {user.resume && <img src={user.resume.url} alt="resume" />}
        <div className="popup-options">
          <Link to="/update/profile" className="profile-btn" onClick={onClose}>Update Profile</Link>
          <Link to="/update/password" className="profile-btn" onClick={onClose}>Update Password</Link>
        </div>
      </div>
    </div>
  );
};

ProfilePopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ProfilePopup;
