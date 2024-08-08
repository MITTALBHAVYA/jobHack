import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BASE_URL } from "../../../helper.js";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Context } from '../../main.jsx';
import { Link } from 'react-router-dom';
import './UpdateProfile.css'; // Import the new CSS file

const UpdateProfile = () => {
  const { token } = useContext(Context);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [firstNiche, setFirstNiche] = useState('');
  const [secondNiche, setSecondNiche] = useState('');
  const [thirdNiche, setThirdNiche] = useState('');
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/user/getUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.user;
        setUser(userData);
        setName(userData.name || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        setAddress(userData.address || '');
        setCoverLetter(userData.coverLetter || '');
        setFirstNiche(userData.niches?.firstNiche || '');
        setSecondNiche(userData.niches?.secondNiche || '');
        setThirdNiche(userData.niches?.thirdNiche || '');
        setResumePreview(userData.resume?.url || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    if (user?.role === "JOB SEEKER") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("coverLetter", coverLetter);
    }
    if (resume) {
      formData.append("resume", resume);
    }
    try {
      await axios.put(`${BASE_URL}/api/v1/user/update/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      });
      toast.success("Profile Updated.");
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setResumePreview(reader.result);
      setResume(file);
    };
  };

  const nichesArray = [
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  return (
    <div className="update-profile-container">
      <div className="update-profile-content">
        <h3>Update Profile</h3>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {user?.role === "JOB SEEKER" && (
          <>
            <div>
              <label>My Preferred Job Niches</label>
              <div>
                <select
                  value={firstNiche}
                  onChange={(e) => setFirstNiche(e.target.value)}
                >
                  {nichesArray.map((element, index) => (
                    <option value={element} key={index}>
                      {element}
                    </option>
                  ))}
                </select>
                <select
                  value={secondNiche}
                  onChange={(e) => setSecondNiche(e.target.value)}
                >
                  {nichesArray.map((element, index) => (
                    <option value={element} key={index}>
                      {element}
                    </option>
                  ))}
                </select>
                <select
                  value={thirdNiche}
                  onChange={(e) => setThirdNiche(e.target.value)}
                >
                  {nichesArray.map((element, index) => (
                    <option value={element} key={index}>
                      {element}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label>Cover Letter</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
              />
            </div>
            <div>
              <label>Upload Resume</label>
              <input type="file" onChange={resumeHandler} />
              {resumePreview && (
                <div className='resumeupdateprofile'>
                  <p>Current Resume:</p>
                  <Link to={resumePreview} target="_blank" className="view-resume">
                    View Resume
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={handleUpdateProfile}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

UpdateProfile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    coverLetter: PropTypes.string,
    niches: PropTypes.shape({
      firstNiche: PropTypes.string,
      secondNiche: PropTypes.string,
      thirdNiche: PropTypes.string,
    }),
    resume: PropTypes.shape({
      url: PropTypes.string,
    }),
    role: PropTypes.string,
  }),
};

export default UpdateProfile;
