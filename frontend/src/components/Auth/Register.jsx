import { useState, useContext } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill, RiLock2Line } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { BASE_URL } from "../../../helper.js";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const { setIsAuthorized,setUser,setToken} = useContext(Context);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/user/register`,
        {
          userName: name,
          phone,
          email,
          role,
          password,
          confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
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
          <img src="/JobZeelogo.png" alt="logo" />
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
          <button type="submit">Register</button>
          <Link to="/login">Login Now</Link>
        </form>
      </div>
      <div className="banner">
        <img src="/register.png" alt="register" />
      </div>
    </section>
  );
};

export default Register;
