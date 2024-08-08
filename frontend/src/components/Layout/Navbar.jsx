import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import useLogout from '../Auth/useLogout';
import { Context } from '../../main';
import ProfilePopup from './ProfilePopup';
import './Navbar.css';

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false); // State to manage profile pop-up visibility
  const { isAuthorized, user } = useContext(Context);
  const handleLogout = useLogout();

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
    setShow(false); // Close the hamburger menu when opening the profile popup
  };

  if (!isAuthorized) {
    return null; // Don't render anything if not authorized
  }

  return (
    <>
      <nav className="navbarShow">
        <div className="container">
          <div className="logo" style={{overflow:"hidden"}}>
            <img src="/JOBHACKWhite.svg" alt="logo" />
          </div>
          <ul className={`menu ${show ? 'show-menu' : ''}`}>
            <li>
              <Link to="/" onClick={() => setShow(false)}>
                HOME
              </Link>
            </li>
            <li>
              <Link to="/job/getAll" onClick={() => setShow(false)}>
                ALL JOBS
              </Link>
            </li>
            <li>
              <Link to="/application/me" onClick={() => setShow(false)}>
                {user?.role === 'EMPLOYER' ? "APPLICANT'S APPLICATIONS" : 'MY APPLICATIONS'}
              </Link>
            </li>
            {user?.role === 'EMPLOYER' && (
              <>
                <li>
                  <Link to="/job/post" onClick={() => setShow(false)}>
                    POST NEW JOB
                  </Link>
                </li>
                <li>
                  <Link to="/job/me" onClick={() => setShow(false)}>
                    VIEW YOUR JOBS
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="#" onClick={toggleProfilePopup}>
                PROFILE
              </Link>
            </li>
            <button onClick={handleLogout}>LOGOUT</button>
          </ul>
          <div className="hamburger">
            <GiHamburgerMenu onClick={() => setShow(!show)} />
          </div>
        </div>
      </nav>
      {showProfilePopup && <ProfilePopup user={user} onClose={toggleProfilePopup} />}
    </>
  );
};

export default Navbar;
