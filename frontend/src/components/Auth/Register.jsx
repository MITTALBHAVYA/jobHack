/*
use of wrpper class div for every selection
*/

import { useState, useContext } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { FaRegUser } from "react-icons/fa";
import { MdCategory,MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill, RiLock2Line } from "react-icons/ri";
import {  FaAddressBook, FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { BASE_URL } from "../../../helper.js";

const Register = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstNiche, setFirstNiche] = useState("");
  const [secondNiche, setSecondNiche] = useState("");
  const [thirdNiche, setThirdNiche] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");

  const nichesArray = [
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];
  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };
  
  const { setIsAuthorized,setUser,setToken} = useContext(Context);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword); // Add confirmPassword to formData
  
    if (role === "JOB SEEKER") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);
    }
  
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/user/register`,
        formData, // Directly pass formData
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Ensure this if you need to send cookies
        }
      );
      toast.success(data.message);
  
      // Store user authentication information in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthorized(true);
      setToken(data.token);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };
  

  return (
    <section className="authPage">
      <div className="container">
        <div className="header">
          <img src="/JOBHACKlogogreen.svg" alt="logo" />
          <h3>Create a new account</h3>
        </div>
        <form onSubmit={handleRegister}>
          <div className="inputTag">
            <label htmlFor="role">Register As</label>
            <div>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="EMPLOYER">Employer</option>
                <option value="JOB SEEKER">Job Seeker</option>
              </select>
              <FaRegUser />
            </div>
          </div>
          <div className="inputTag">
            <label htmlFor="name">Name</label>
            <div>
              <input
                id="name"
                type="text"
                placeholder="Enter Your Name Here"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <FaPencilAlt />
            </div>
          </div>
          <div className="inputTag">
            <label htmlFor="email">Email Address</label>
            <div>
              <input
                id="email"
                type="email"
                placeholder="Enter Your Email Here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <MdOutlineMailOutline />
            </div>
          </div>
          <div className="inputTag">
            <label htmlFor="phone">Phone Number</label>
            <div>
              <input
                id="phone"
                type="number"
                placeholder="Enter Your Phone Number Here"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <FaPhoneFlip />
            </div>
          </div>
          <div className="inputTag">
                <label>Address</label>
                <div>
                  <input
                    type="text"
                    placeholder="Your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <FaAddressBook />
                </div>
              </div>
          <div className="inputTag">
            <label htmlFor="password">Password</label>
            <div>
              <input
                id="password"
                type="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <RiLock2Fill />
            </div>
          </div>
          <div className="inputTag">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div>
              <input
                id="confirmPassword"
                type="password"
                placeholder="*********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <RiLock2Line />
            </div>
          </div>
          {role === "JOB SEEKER" && (
              <>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Your First Niche</label>
                    <div>
                      <select
                        value={firstNiche}
                        onChange={(e) => setFirstNiche(e.target.value)}
                      >
                        <option value="">Your Niche</option>
                        {nichesArray.map((niche, index) => {
                          return (
                            <option key={index} value={niche}>
                              {niche}
                            </option>
                          );
                        })}
                      </select>
                      <MdCategory />
                    </div>
                  </div>
                  <div className="inputTag">
                    <label>Your Second Niche</label>
                    <div>
                      <select
                        value={secondNiche}
                        onChange={(e) => setSecondNiche(e.target.value)}
                      >
                        <option value="">Your Niche</option>
                        {nichesArray.map((niche, index) => {
                          return (
                            <option key={index} value={niche}>
                              {niche}
                            </option>
                          );
                        })}
                      </select>
                      <MdCategory />
                    </div>
                  </div>
                  <div className="inputTag">
                    <label>Your Third Niche</label>
                    <div>
                      <select
                        value={thirdNiche}
                        onChange={(e) => setThirdNiche(e.target.value)}
                      >
                        <option value="">Your Niche</option>
                        {nichesArray.map((niche, index) => {
                          return (
                            <option key={index} value={niche}>
                              {niche}
                            </option>
                          );
                        })}
                      </select>
                      <MdCategory />
                    </div>
                  </div>
                </div>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Coverletter</label>
                    <div>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={10}
                      />
                    </div>
                  </div>
                </div>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Resume</label>
                    <div>
                      <input
                        type="file"
                        onChange={resumeHandler}
                        style={{ border: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          <button type="submit">Register</button>
          <Link to="/login">Login Now</Link>
        </form>
      </div>
      <div className="banner">
        <img src="/register.svg" alt="register" />
      </div>
    </section>
  );
};

export default Register;
