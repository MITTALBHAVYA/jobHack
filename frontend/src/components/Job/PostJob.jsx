import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { BASE_URL } from "../../../helper.js";

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    category: "",
    country: "",
    location: "",
    salaryFrom: "",
    salaryTo: "",
    fixedSalary: "",
    salaryType: "default",
  });

  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();

  const handleJobPost = async (e) => {
    e.preventDefault();
    const { salaryType, fixedSalary, salaryFrom, salaryTo, ...rest } = jobData;
    const postData =
      salaryType === "Fixed Salary"
        ? { ...rest, fixedSalary }
        : salaryType === "Ranged Salary"
        ? { ...rest, salaryFrom, salaryTo }
        : { ...rest };

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/job/post`,
        postData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      // setJobData({
      //   title: "",
      //   description: "",
      //   category: "",
      //   country: "",
      //   location: "",
      //   salaryFrom: "",
      //   salaryTo: "",
      //   fixedSalary: "",
      //   salaryType: "default",
      // });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    }
  };

  if (!isAuthorized || (user && user.role !== "EMPLOYER")) {
    navigate("/login");
  }

  const handleInputChange = ({ target: { name, value } }) => {
    setJobData((prevJobData) => ({ ...prevJobData, [name]: value }));
  };

  return (
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
              name="category"
              value={jobData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {[
                "Graphics & Design",
                "Mobile App Development",
                "Frontend Web Development",
                "MERN Stack Development",
                "Account & Finance",
                "Artificial Intelligence",
                "Video Animation",
                "MEAN Stack Development",
                "MEVN Stack Development",
                "Data Entry Operator",
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="wrapper">
            <input
              type="text"
              name="country"
              value={jobData.country}
              onChange={handleInputChange}
              placeholder="Country"
              required
            />
          </div>
          <input
            type="text"
            name="location"
            value={jobData.location}
            onChange={handleInputChange}
            placeholder="Location"
            required
          />
          <div className="salary_wrapper">
            <select
              name="salaryType"
              value={jobData.salaryType}
              onChange={handleInputChange}
              required
            >
              <option value="default">Select Salary Type</option>
              <option value="Fixed Salary">Fixed Salary</option>
              <option value="Ranged Salary">Ranged Salary</option>
            </select>
            <div>
              {jobData.salaryType === "Fixed Salary" && (
                <input
                  type="number"
                  name="fixedSalary"
                  placeholder="Enter Fixed Salary"
                  value={jobData.fixedSalary}
                  onChange={handleInputChange}
                  required
                />
              )}
              {jobData.salaryType === "Ranged Salary" && (
                <div className="ranged_salary">
                  <input
                    type="number"
                    name="salaryFrom"
                    placeholder="Salary From"
                    value={jobData.salaryFrom}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="number"
                    name="salaryTo"
                    placeholder="Salary To"
                    value={jobData.salaryTo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
            </div>
          </div>
          <textarea
            rows="10"
            name="description"
            value={jobData.description}
            onChange={handleInputChange}
            placeholder="Job Description"
            required
          />
          <button type="submit">Create Job</button>
        </form>
      </div>
    </section>
  );
};

export default PostJob;
