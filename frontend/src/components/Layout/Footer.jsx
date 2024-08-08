import { useContext } from "react";
import { Context } from "../../main";
import { FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import './Footer.css'

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  if(!isAuthorized){
    return null;
  }
  return (
    <footer className="footerShow">
      <p>&copy; All Rights Reserved By Bhavya Mittal.</p>
      <nav className="">
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <FaYoutube />
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <RiInstagramFill />
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
