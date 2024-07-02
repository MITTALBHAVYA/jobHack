import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/job/getMyJobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "EMPLOYER")) {
      navigate("/");
    }
  }, [isAuthorized, user, navigate]);

  const toggleEditMode = (jobId) => {
    setEditingJobId(editingJobId === jobId ? null : jobId);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    try {
      const { data } = await axios.put(
        `http://localhost:3000/api/v1/job/update/${jobId}`,
        updatedJob,
        { withCredentials: true }
      );
      toast.success(data.message);
      setEditingJobId(null);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3000/api/v1/job/delete/${jobId}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: field === "expired" ? value === "true" : value } : job
      )
    );
  };

  const renderInput = (label, value, field, jobId, type = "text") => (
    <div>
      <span>{label}:</span>
      <input
        type={type}
        disabled={editingJobId !== jobId}
        value={value}
        onChange={(e) => handleInputChange(jobId, field, e.target.value)}
      />
    </div>
  );

  const renderSelect = (label, value, field, jobId, options) => (
    <div>
      <span>{label}:</span>
      <select
        value={value}
        onChange={(e) => handleInputChange(jobId, field, e.target.value)}
        disabled={editingJobId !== jobId}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {String(option)}
          </option>
        ))}
      </select>
    </div>
  );

  const renderTextarea = (label, value, field, jobId) => (
    <div>
      <span>{label}:</span>
      <textarea
        rows={5}
        value={value}
        disabled={editingJobId !== jobId}
        onChange={(e) => handleInputChange(jobId, field, e.target.value)}
      />
    </div>
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
                country,
                category,
                fixedSalary,
                salaryFrom,
                salaryTo,
                expired,
                description,
                location,
              } = job;

              return (
                <div className="card" key={_id}>
                  <div className="content">
                    <div className="short_fields">
                      {renderInput("Title", title, "title", _id)}
                      {renderInput("Country", country, "country", _id)}
                      {renderSelect("Category", category, "category", _id, [
                        "Graphics & Design",
                        "Mobile App Development",
                        "Frontend Web Development",
                        "MERN STACK Development",
                        "Account & Finance",
                        "Artificial Intelligence",
                        "Video Animation",
                        "MEAN STACK Development",
                        "MEVN STACK Development",
                        "Data Entry Operator",
                      ])}
                      {fixedSalary
                        ? renderInput("Salary", fixedSalary, "fixedSalary", _id, "number")
                        : (
                          <div>
                            <span>Salary:</span>
                            <div>
                              {renderInput("From", salaryFrom, "salaryFrom", _id, "number")}
                              {renderInput("To", salaryTo, "salaryTo", _id, "number")}
                            </div>
                          </div>
                        )}
                      {renderSelect("Expired", expired, "expired", _id, [true, false])}
                    </div>
                    <div className="long_field">
                      {renderTextarea("Description", description, "description", _id)}
                      {renderTextarea("Location", location, "location", _id)}
                    </div>
                  </div>
                  <div className="button_wrapper">
                    <div className="edit_btn_wrapper">
                      {editingJobId === _id ? (
                        <>
                          <button
                            onClick={() => handleUpdateJob(_id)}
                            className="check_btn"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => toggleEditMode(null)}
                            className="cross_btn"
                          >
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => toggleEditMode(_id)}
                          className="edit_btn"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteJob(_id)}
                      className="delete_btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>You&apos;ve not posted any job or maybe you deleted all of your jobs!</p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
