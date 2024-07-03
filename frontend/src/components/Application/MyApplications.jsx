import { useContext, useEffect, useState } from "react";
import { Context } from "../../main.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ResumeModal from "./ResumeModal.jsx";
import { BASE_URL } from "../../../helper.js";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  // const {user} =useContext(Context);
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState("");
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const endpoint = user.role === "EMPLOYER"
          ? "employer/getAll"
          : "jobseeker/getAll";
        
        const { data } = await axios.get(`${BASE_URL}/api/v1/application/${endpoint}`, {
          withCredentials: true,
        }
      );
      const formattedApplications = data.applications.map(app => ({
        ...app,
        phone: app.phone.toString(), // Ensure phone is a string
      }));
      setApplications(formattedApplications);
        
        setApplications(data.applications);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    if (isAuthorized) {
      fetchApplications();
    } else {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);
  
  const deleteApplication = async (id) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/api/v1/application/delete/${id}`, {
        withCredentials: true,
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
        <h1>{user.role === "JOB SEEKER" ? "My Applications" : "Applications From JOB SEEKERs"}</h1>
        {applications.length === 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              deleteApplication={deleteApplication}
              openModal={openModal}
              isJobSeeker={user.role === "JOB SEEKER"}
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
      <p><span>Name:</span> {application.name}</p>
      <p><span>Email:</span> {application.email}</p>
      <p><span>Phone:</span> {application.phone}</p>
      <p><span>Address:</span> {application.address}</p>
      <p><span>Cover Letter:</span> {application.coverLetter}</p>
    </div>
    <div className="resume">
      <img src={application.resume.url} alt="resume" onClick={() => openModal(application.resume.url)} />
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
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired,
    coverLetter: PropTypes.string.isRequired,
    resume: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  deleteApplication: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  isJobSeeker: PropTypes.bool.isRequired,
};

export default MyApplications;
