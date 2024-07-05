import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import useLogout from '../Auth/useLogout';
import { Context } from '../../main';

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, user } = useContext(Context);
  const handleLogout = useLogout();

  return (
    <nav className={isAuthorized ? 'navbarShow' : 'navbarHide'}>
      <div className="container">
        <div className="logo">
          <img src="/JobZee-logos__white.png" alt="logo" />
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
          <button onClick={handleLogout}>LOGOUT</button>
        </ul>
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
