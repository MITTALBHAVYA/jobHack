import { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { BASE_URL } from "../../../helper.js";
import "./PostJob.css";

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: "",
    jobType: "Full-time",
    location: "",
    companyName: "",
    introduction: "",
    responsibilities: "",
    qualifications: "",
    offers: "",
    salary: "",
    hiringMultipleCandidates: "No",
    personalWebsite: {
      title: "",
      url: ""
    },
    jobNiche: "",
  });

  const { isAuthorized, token } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
    }
  }, [isAuthorized, navigate]);

  const handleJobPost = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/job/post`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setJobData({
        title: "",
        jobType: "Full-time",
        location: "",
        companyName: "",
        introduction: "",
        responsibilities: "",
        qualifications: "",
        offers: "",
        salary: "",
        hiringMultipleCandidates: "No",
        personalWebsite: {
          title: "",
          url: ""
        },
        jobNiche: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setJobData((prevJobData) => ({ ...prevJobData, [name]: value }));
  };

  const handlePersonalWebsiteChange = ({ target: { name, value } }) => {
    setJobData((prevJobData) => ({
      ...prevJobData,
      personalWebsite: {
        ...prevJobData.personalWebsite,
        [name]: value,
      }
    }));
  };

  return (
    <>
      <section className="job_post page">
        <div className="container">
          <h3>POST NEW JOB</h3>
          <form onSubmit={handleJobPost}>
            <div className="wrapper">
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleInputChange}
                placeholder="Job Title"
                required
              />
              <select
                name="jobType"
                value={jobData.jobType}
                onChange={handleInputChange}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="wrapper">
              <input
                type="text"
                name="companyName"
                value={jobData.companyName}
                onChange={handleInputChange}
                placeholder="Company Name"
                required
              />
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleInputChange}
                placeholder="Location"
                required
              />
            </div>
            <textarea
              name="introduction"
              value={jobData.introduction}
              onChange={handleInputChange}
              placeholder="Introduction"
            />
            <textarea

              name="responsibilities"
              value={jobData.responsibilities}
              onChange={handleInputChange}
              placeholder="Responsibilities"
              required
            />
            <textarea

              name="qualifications"
              value={jobData.qualifications}
              onChange={handleInputChange}
              placeholder="Qualifications"
              required
            />
            <textarea

              name="offers"
              value={jobData.offers}
              onChange={handleInputChange}
              placeholder="Offers"
            />
            <input
              type="text"
              name="salary"
              value={jobData.salary}
              onChange={handleInputChange}
              placeholder="Salary"
              required
            />
            <div className="wrapper">
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={{ marginBottom: '10px', fontSize: '1.2rem' }}>Hiring Multiple Candidates:</legend>
                <div style={{ display: 'flex', gap: '10px', fontSize: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="hiringMultipleCandidates"
                      value="Yes"
                      checked={jobData.hiringMultipleCandidates === "Yes"}
                      onChange={handleInputChange}
                      required
                      style={{ marginRight: '5px' }}
                    />
                    Yes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="hiringMultipleCandidates"
                      value="No"
                      checked={jobData.hiringMultipleCandidates === "No"}
                      onChange={handleInputChange}
                      required
                      style={{ marginRight: '5px' }}
                    />
                    No
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="wrapper">
              <input
                type="text"
                name="title"
                value={jobData.personalWebsite.title}
                onChange={handlePersonalWebsiteChange}
                placeholder="Personal Website Title"
              />
              <input
                type="text"
                name="url"
                value={jobData.personalWebsite.url}
                onChange={handlePersonalWebsiteChange}
                placeholder="Personal Website URL"
              />
            </div>
            <input
              type="text"
              name="jobNiche"
              value={jobData.jobNiche}
              onChange={handleInputChange}
              placeholder="Job Niche"
              required
            />
            <button type="submit">Create Job</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default PostJob;
