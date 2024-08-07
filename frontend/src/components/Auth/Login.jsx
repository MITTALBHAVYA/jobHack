import { useState, useContext } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { BASE_URL } from "../../../helper.js";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { setIsAuthorized, setUser, setToken, token } = useContext(Context);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (!token) {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/v1/user/login`,
          {
            email,
            role,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(data.message);
        setEmail("");
        setPassword("");
        setRole("");
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthorized(true);
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
      }
    }
    else {
      setIsAuthorized(true);
      navigate("/");
    }
  };

  return (
    <section className="authPage">
      <div className="container">
        <div className="header">
          <img src="/JOBHACKlogogreen.svg" alt="logo" />
          <h3>Login To Your Account</h3>
        </div>
        <form onSubmit={handleLogin}>
          <div className="inputTag">
            <label htmlFor="role">Login As</label>
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

          <button type="submit">Login</button>
          <Link to="/register">Register Now</Link>
        </form>
      </div>
      <div className="banner">
        <img src="/login.png" alt="login" />
      </div>
    </section>
  );
};

export default Login;
