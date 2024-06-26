import {useState,useContext} from 'react';
import {Context} from '../../main';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {GiHamburgerMenu} from 'react-icons/gi';
import toast from 'react-hot-toast';
import axios from 'axios';


const Navbar = () => {
  const [show,setShow]=useState(false);
  const {isAuthorized,setIsAuthorized,user}=useContext(Context);
  const navigateTo=useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/user/logout",{withCredentials:true});
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    }
    catch (error) {
      toast.error(`Something went wrong : ${error.response?.data?.message || error.message}`);
      console.log(error);
      setIsAuthorized(true);
    }
  };
  return (
    <>
      <nav className={isAuthorized?"navbarShow":"navbarHide"}>
        <div className="container">
          <div className="logo">
            <img src="/JobZee-logos__white.png" alt="logo" />
          </div>
          <ul className={`menu ${show ? "show-menu" : ""}`}>
          <li>
            <Link to={"/"} onClick={()=>setShow(false)}>
            HOME
            </Link>
          </li>
          <li>
            <Link to={"/job/getAll"} onClick={()=>setShow(false)}>
            ALL JOBS
            </Link>
          </li>
          <li>
            <Link to={"/applications/me"} onClick={()=>setShow(false)}>
            {user && user.role !== "JOB SEEKER" ? "APPLICATIONS" : "MY APPLICATIONS"}
            </Link>
          </li>
          {user && user.role !== "JOB SEEKER" ? (
            <>
            <li>
              <Link to={"/job/post"} onClick={()=>setShow(false)}>
              POST NEW JOB
              </Link>
            </li>
            <li>
              <Link to={"/jobs/me"} onClick={()=>setShow(false)}>
              VIEW YOUR JOBS
              </Link>
            </li>
            </>
            ):(
              <></>
            )
          } 
          <button onClick={handleLogout}>LOGOUT</button>
          </ul>
          <div className="hamburger">
            <GiHamburgerMenu onClick={()=>setShow(!show)}/>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
