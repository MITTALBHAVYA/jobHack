import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="page notfound">
      <div className="content">
        <img src="/notfound.png" alt="A graphic illustrating page not found" />
        <Link to="/" aria-label="Return to Home Page">RETURN TO HOME</Link>
      </div>
    </section>
  );
};

export default NotFound;
