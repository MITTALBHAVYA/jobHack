import { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);

  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved By Bhavya Mittal.</div>
      <div>
        <Link to={"https://www.youtube.com"} target="_blank" aria-label="YouTube">
          <FaYoutube />
        </Link>
        <Link to={"https://www.linkedin.com"} target="_blank" aria-label="LinkedIn">
          <FaLinkedin />
        </Link>
        <Link to={"https://www.instagram.com"} target="_blank" aria-label="Instagram">
          <RiInstagramFill />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
