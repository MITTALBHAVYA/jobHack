import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import "./InfoSection.css";
const InfoSection = () => {
  return (
    <>
    <div className="howitworks">
      <div className="container">
        <h3>HOW JOBHACK WORKS</h3>
        <div className="banner">
          <div className="card">
            <FaUserPlus aria-label="Create Account" />
            <p>Create Account</p>
            <p>
              Sign up and create your account to start exploring job
              opportunities or posting jobs.
            </p>
          </div>
          <div className="card">
            <MdFindInPage aria-label="Find a Job/Post a Job" />
            <p>Find a Job/Post a Job</p>
            <p>
              Browse through job listings or post job opportunities tailored to
              your needs.
            </p>
          </div>
          <div className="card">
            <IoMdSend aria-label="Apply For Job/Recruit Suitable Candidates" />
            <p>Apply For Job/Recruit Suitable Candidates</p>
            <p>
              Apply for jobs matching your skills or recruit suitable candidates
              for your job openings.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default InfoSection;
