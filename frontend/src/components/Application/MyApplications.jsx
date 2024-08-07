import { useContext, useEffect, useState } from "react";
import { Context } from "../../main.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ResumeModal from "./ResumeModal.jsx";
import { BASE_URL } from "../../../helper.js";
import "./MyApplications.css";

const MyApplications = () => {
  const { user, isAuthorized, token } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const endpoint = user && user.role === "EMPLOYER" ? "employer/getAll" : "jobseeker/getAll";
        
        const { data } = await axios.get(`${BASE_URL}/api/v1/application/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setApplications(data.applications);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    if (isAuthorized) {
      fetchApplications();
    } else {
      navigate("/");
    }
  }, [isAuthorized, user, navigate, token]);

  const deleteApplication = async (id) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/api/v1/application/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      toast.success(data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (resumeUrl) => {
    setSelectedResumeUrl(resumeUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="my_applications page">
      <div className="container">
        <h1>{user?.role === "JOB SEEKER" ? "My Applications" : "Applications From JOB SEEKER"}</h1>
        {applications.length === 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              deleteApplication={deleteApplication}
              openModal={openModal}
              isJobSeeker={user?.role === "JOB SEEKER"}
            />
          ))
        )}
      </div>
      {isModalOpen && <ResumeModal imageUrl={selectedResumeUrl} onClose={closeModal} />}
    </section>
  );
};

const ApplicationCard = ({ application, deleteApplication, openModal, isJobSeeker }) => (
  <div className="job_seeker_card">
    <div className="detail">
      <p><span>Job Title:</span> {application.jobInfo.jobTitle}</p>
      <p><span>Name:</span> {application.jobSeekerInfo.name}</p>
      <p><span>Email:</span> {application.jobSeekerInfo.email}</p>
      <p><span>Phone:</span> {application.jobSeekerInfo.phone}</p>
      <p><span>Address:</span> {application.jobSeekerInfo.address}</p>
      <p><span>Cover Letter:</span> {application.jobSeekerInfo.coverLetter}</p>
    </div>
    <div className="resume">
      <img src={application.jobSeekerInfo.resume.url} alt="resume" onClick={() => openModal(application.jobSeekerInfo.resume.url)} />
    </div>
    {isJobSeeker && (
      <div className="btn_area">
        <button onClick={() => deleteApplication(application._id)}>Delete Application</button>
      </div>
    )}
  </div>
);

ApplicationCard.propTypes = {
  application: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    jobInfo: PropTypes.shape({
      jobTitle: PropTypes.string.isRequired,
    }).isRequired,
    jobSeekerInfo: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      coverLetter: PropTypes.string.isRequired,
      resume: PropTypes.shape({
        url: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  deleteApplication: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  isJobSeeker: PropTypes.bool.isRequired,
};

export default MyApplications;
