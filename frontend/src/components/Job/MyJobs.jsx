import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../helper.js";
import "./MyJobs.css";
const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const { isAuthorized, token } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/job/getMyJobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setMyJobs(data.myJobs.map(job => ({
          ...job,
          expired: job.expired === true || job.expired === 'true' // Ensure expired is boolean
        })));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch jobs");
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, [isAuthorized, navigate, token]);

  const toggleEditMode = (jobId) => {
    setEditingJobId((editingJobId === jobId) ? null : jobId);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/v1/job/update/${jobId}`,
        updatedJob,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      toast.success(data.message);
      setEditingJobId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/api/v1/job/delete/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      toast.success(data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? {
          ...job,
          [field]: field === "expired" ? value === "true" : value
        } : job
      )
    );
  };

  const renderInput = (label, value, field, jobId, type = "text") => (
    value ? (
      <div style={{ marginBottom: "10px" }}>
        <span style={{ fontWeight: "bold" }}>{label}:</span>
        <input
          type={type}
          disabled={editingJobId !== jobId}
          value={value || ""}
          onChange={(e) => handleInputChange(jobId, field, e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>
    ) : null
  );

  const renderSelect = (label, value, field, jobId, options) => (
    value !== undefined ? (
      <div style={{ marginBottom: "10px" }}>
        <span style={{ fontWeight: "bold" }}>{label}:</span>
        <select
          value={String(value)}
          onChange={(e) => handleInputChange(jobId, field, e.target.value)}
          disabled={editingJobId !== jobId}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          {options.map((option) => (
            <option key={option} value={String(option)}>
              {String(option)}
            </option>
          ))}
        </select>
      </div>
    ) : null
  );

  const renderTextarea = (label, value, field, jobId) => (
    value ? (
      <div style={{ marginBottom: "10px" }}>
        <span style={{ fontWeight: "bold" }}>{label}:</span>
        <textarea
          rows={5}
          value={value || ""}
          disabled={editingJobId !== jobId}
          onChange={(e) => handleInputChange(jobId, field, e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>
    ) : null
  );

  return (
    <div className="myJobs page">
      <div className="container">
        <h1>Your Posted Jobs</h1>
        {myJobs.length > 0 ? (
          <div className="banner">
            {myJobs.map((job) => {
              const {
                _id,
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
                newsLettersSent,
                expired,
              } = job;

              return (
                <div className="card" key={_id} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
                  <div className="content">
                    <div className="short_fields">
                      <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "10px", fontSize: "2rem" }}>
                        {title}
                      </div>
                      {renderInput("Job Type", jobType, "jobType", _id)}
                      {renderInput("Location", location, "location", _id)}
                      {renderInput("Company Name", companyName, "companyName", _id)}
                      {renderTextarea("Introduction", introduction, "introduction", _id)}
                      {renderTextarea("Responsibilities", responsibilities, "responsibilities", _id)}
                      {renderTextarea("Qualifications", qualifications, "qualifications", _id)}
                      {renderTextarea("Offers", offers, "offers", _id)}
                      {renderInput("Salary", salary, "salary", _id)}
                      {renderSelect("Hiring Multiple Candidates", hiringMultipleCandidates, "hiringMultipleCandidates", _id, ["Yes", "No"])}
                      {renderInput("Personal Website Title", personalWebsite?.title, "personalWebsite.title", _id)}
                      {renderInput("Personal Website URL", personalWebsite?.url, "personalWebsite.url", _id)}
                      {renderInput("Job Niche", jobNiche, "jobNiche", _id)}
                      {renderSelect("Newsletters Sent", newsLettersSent, "newsLettersSent", _id, [true, false])}
                      {renderSelect("Expired", expired, "expired", _id, [true, false])}
                    </div>
                  </div>
                  <div className="button_wrapper">
                    <div className="edit_btn_wrapper">
                      {editingJobId === _id ? (
                        <>
                          <button
                            onClick={() => handleUpdateJob(_id)}
                            className="check_btn"
                            style={{ cursor: "pointer", marginRight: "5px" }}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => toggleEditMode(null)}
                            className="cross_btn"
                            style={{ cursor: "pointer" }}
                          >
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => toggleEditMode(_id)}
                          className="edit_btn"
                          style={{ cursor: "pointer" }}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteJob(_id)}
                      className="delete_btn"
                      style={{ cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>You’ve not posted any job or maybe you deleted all of your jobs!</p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
