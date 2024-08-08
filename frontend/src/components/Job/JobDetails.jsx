import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Context } from '../../main';
import { BASE_URL } from '../../../helper.js';
import "./JobDetails.css";
const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthorized, user } = useContext(Context);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        let config = {
          headers: {}
        };

        // Check if there's a token in localStorage
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Fallback to withCredentials for cookie-based auth
          config.withCredentials = true;
        }

        const { data } = await axios.get(`${BASE_URL}/api/v1/job/${jobId}`, config);
        setJob(data.job);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        navigate("/notfound");
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthorized) {
      navigate("/login");
    } else {
      fetchJobDetails();
    }
  }, [isAuthorized, jobId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsite,
    jobNiche,
    jobPostedOn,
    _id
  } = job;

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>Title: <span>{title}</span></p>
          <p>Job Type: <span>{jobType}</span></p>
          <p>Location: <span>{location}</span></p>
          <p>Company Name: <span>{companyName}</span></p>
          <p>Introduction: <span>{introduction}</span></p>
          <p>Responsibilities: <span>{responsibilities}</span></p>
          <p>Qualifications: <span>{qualifications}</span></p>
          <p>Offers: <span>{offers}</span></p>
          <p>Salary: <span>{salary}</span></p>
          <p>Hiring Multiple Candidates: <span>{hiringMultipleCandidates}</span></p>
          {personalWebsite?.url && (
            <p>Personal Website: <a href={personalWebsite.url} target="_blank" rel="noopener noreferrer">{personalWebsite.title || 'Visit Website'}</a></p>
          )}
          <p>Job Niche: <span>{jobNiche}</span></p>
          <p>Job Posted On: <span>{new Date(jobPostedOn).toLocaleDateString()}</span></p>
          {user?.role === "JOB SEEKER" && <Link to={`/application/${_id}`} className='jobapplynow'>Apply Now</Link>}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
