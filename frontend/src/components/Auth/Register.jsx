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

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const { setIsAuthorized } = useContext(Context);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        {
          userName:name,
          phone:phone,
          email:email,
          role:role,
          password:password,
          confirmPassword:confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
      setIsAuthorized(true);
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
        <form>
          <div className="inputTag">
            <label>Register As</label>
            <div>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="EMPLOYER">Employer</option>
                <option value="JOB SEEKER">Job Seeker</option>
              </select>
              <FaRegUser />
            </div>
          </div>
          <div className="inputTag">
            <label>Name</label>
            <div>
              <input
                type="text"
                placeholder="Enter Your Name Here"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FaPencilAlt />
            </div>
          </div>
          <div className="inputTag">
            <label>Email Address</label>
            <div>
              <input
                type="email"
                placeholder="Enter Your Email Here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MdOutlineMailOutline />
            </div>
          </div>
          <div className="inputTag">
            <label>Phone Number</label>
            <div>
              <input
                type="number"
                placeholder="Enter Your Phone Number Here"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <FaPhoneFlip />
            </div>
          </div>
          <div className="inputTag">
            <label>Password</label>
            <div>
              <input
                type="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <RiLock2Fill />
            </div>
          </div>
          <div className="inputTag">
            <label>Confirm Password</label>
            <div>
              <input
                type="password"
                placeholder="*********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <RiLock2Line />
            </div>
          </div>
          <button type="submit" onClick={handleRegister}>
            Register
          </button>
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
