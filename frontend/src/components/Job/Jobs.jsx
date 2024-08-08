import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { BASE_URL } from "../../../helper.js";
import "./Jobs.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [niche, setNiche] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expired, setExpired] = useState(false);
  const { isAuthorized, token } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
    } else {
      const fetchJobs = async () => {
        try {
          const { data } = await axios.get(`${BASE_URL}/api/v1/job/getAll`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              city,
              niche,
              searchKeyword,
              expired,
            },
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
  }, [isAuthorized, navigate, token, city, niche, searchKeyword, expired]);

  const handleFilterChange = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <section className="jobs page">
        <div className="container">
          <h1>ALL AVAILABLE JOBS</h1>
          <form onSubmit={handleFilterChange} className="job-filter-form">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search Keyword"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={expired}
                onChange={(e) => setExpired(e.target.checked)}
              />
              Show Expired Jobs
            </label>
            <button type="submit">Filter</button>
          </form>
          <div className="banner">
            {jobs.map(({ _id, title, category, country, location }) => {
              return (
                <div className="card" key={_id}>
                  <p>{title}</p>
                  <p>{category}</p>
                  <p>{country}</p>
                  <p>{location}</p>
                  <Link to={`/job/${_id}`} className="job-link">Job Details</Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Jobs;
