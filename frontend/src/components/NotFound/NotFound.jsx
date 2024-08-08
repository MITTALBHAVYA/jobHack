import { Link } from "react-router-dom";
import "./NotFound.css";
const NotFound = () => {
  return (
    <section className="page notfound">
      <div className="content">
        <img src="/notfound.png" alt="page not found" />
        <Link to="/" aria-label="Return to Home Page">RETURN TO HOME</Link>
      </div>
    </section>
  );
};

export default NotFound;
