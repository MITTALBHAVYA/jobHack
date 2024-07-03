import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { BASE_URL } from "../../../helper.js";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthorized } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    } else {
      const fetchJobs = async () => {
        try {
          const { data } = await axios.get(`${BASE_URL}/api/v1/job/getAll`, {
            withCredentials: true,
          });
          setJobs(data.jobs);
        } catch (error) {
          setError(error.response?.data?.message || error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchJobs();
    }
  }, [isAuthorized, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner">
          {jobs.map(({ _id, title, category, country, location }) =>{ 
            return (
            <div className="card" key={_id}>
              <p>{title}</p>
              <p>{category}</p>
              <p>{country}</p>
              <p>{location}</p>
              <Link to={`/job/${_id}`}>Job Details</Link>
            </div>
          );})}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
