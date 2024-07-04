import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Context } from '../../main';
import { BASE_URL } from '../../../helper.js';

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
      return;
    }

    const fetchJobDetails = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/job/${jobId}`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }});
        setJob(data.job);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        navigate("/notfound");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const {
    title,
    category,
    country,
    location,
    description,
    jobPostedOn,
    fixedSalary,
    salaryFrom,
    salaryTo,
    _id,
  } = job;

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>Title: <span>{title}</span></p>
          <p>Category: <span>{category}</span></p>
          <p>Country: <span>{country}</span></p>
          <p>Location: <span>{location}</span></p>
          <p>Description: <span>{description}</span></p>
          <p>Job Posted On: <span>{jobPostedOn}</span></p>
          <p>Salary: {fixedSalary ? <span>{fixedSalary}</span> : <span>{salaryFrom} - {salaryTo}</span>}</p>
          {user && user.role !== "EMPLOYER" && (
            <Link to={`/application/${_id}`}>Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
